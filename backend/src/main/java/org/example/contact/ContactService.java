package org.example.contact;

import org.example.exception.BadRequestException;
import org.example.exception.ResourceNotFoundException;
import org.example.notify.Notifier;
import org.example.reviews.ReviewRules;
import org.example.reviews.SubmissionLimiter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

/**
 * Contact form: messages are stored for the owner's inbox in the admin panel and, when configured, forwarded as an
 * e-mail alert. Spam defences as for comments: a honeypot field and a per-address hourly limit kept in memory.
 */
@Service
public class ContactService {

    private static final Logger LOG = LoggerFactory.getLogger(ContactService.class);
    /** Deliberately simple: something@something.tld, no spaces. The real check is the owner's reply. */
    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    /** What a visitor sends; {@code honeypot} is a hidden form field that people leave empty and bots fill. */
    public record Submission(String name, String email, String message, String honeypot) {
    }

    private final ContactMessageRepository messages;
    private final SubmissionLimiter limiter;
    private final Notifier notifier;
    private final Clock clock;
    private final Duration retention;

    @Autowired
    public ContactService(ContactMessageRepository messages, Notifier notifier,
                          @Value("${app.contact.max-per-hour:3}") int maxPerHour,
                          @Value("${app.contact.retention-days:365}") int retentionDays) {
        this(messages, new SubmissionLimiter(maxPerHour), notifier, Clock.systemUTC(), Duration.ofDays(retentionDays));
    }

    ContactService(ContactMessageRepository messages, SubmissionLimiter limiter, Notifier notifier, Clock clock,
                   Duration retention) {
        this.messages = messages;
        this.limiter = limiter;
        this.notifier = notifier;
        this.clock = clock;
        this.retention = retention;
    }

    /**
     * Stores the message and sends the owner an alert. A filled honeypot is accepted silently and dropped.
     *
     * @throws BadRequestException     empty fields after normalisation, or an address that is not an e-mail
     * @throws ResponseStatusException 429 when the address exceeded the hourly limit
     */
    @Transactional
    public void submit(Submission submission, String clientAddress) {
        if (submission.honeypot() != null && !submission.honeypot().isBlank()) {
            return;
        }
        if (!limiter.tryAcquire(clientAddress)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many messages, try again later");
        }
        String name = ReviewRules.normalise(submission.name()).replace('\n', ' ');
        String email = submission.email().strip();
        String message = ReviewRules.normalise(submission.message());
        if (name.isEmpty() || message.length() < ContactRules.MIN_MESSAGE) {
            throw new BadRequestException("Name and message are required");
        }
        if (!EMAIL.matcher(email).matches()) {
            throw new BadRequestException("Invalid e-mail address");
        }
        messages.save(ContactMessage.builder()
                .name(name)
                .email(email)
                .message(message)
                .read(false)
                .receivedAt(clock.instant())
                .build());
        notifier.send("Portfolio: message from " + name,
                name + " <" + email + "> wrote through the contact form:\n\n" + message
                        + "\n\nReply to this e-mail to answer. All messages: admin panel of the site.",
                email);
    }

    @Transactional(readOnly = true)
    public List<ContactMessage> all() {
        return messages.findAllByOrderByReceivedAtDesc();
    }

    @Transactional(readOnly = true)
    public long unread() {
        return messages.countByReadFalse();
    }

    @Transactional
    public ContactMessage markRead(long id, boolean read) {
        ContactMessage message = messages.findById(id).orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        message.setRead(read);
        return message;
    }

    @Transactional
    public void delete(long id) {
        if (!messages.existsById(id)) {
            throw new ResourceNotFoundException("Message not found");
        }
        messages.deleteById(id);
    }

    /** LGPD retention: messages (name, e-mail, text) are deleted after the retention period. */
    @Scheduled(cron = "0 40 3 * * *", zone = "UTC")
    @Transactional
    public void purgeOld() {
        int removed = messages.deleteOlderThan(clock.instant().minus(retention));
        if (removed > 0) {
            LOG.info("Deleted {} contact messages older than {} days", removed, retention.toDays());
        }
    }

    /** The limiter is private to this service (not the comments' bean), so its sweep is scheduled here. */
    @Scheduled(fixedRate = 10, timeUnit = TimeUnit.MINUTES)
    public void forgetIdleClients() {
        limiter.forgetIdleClients();
    }
}
