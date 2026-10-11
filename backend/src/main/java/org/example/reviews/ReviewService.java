package org.example.reviews;

import org.example.exception.BadRequestException;
import org.example.exception.ResourceNotFoundException;
import org.example.notify.Notifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Visitor reviews: submissions wait for the owner's approval; only approved reviews are public.
 * Spam defences: a honeypot field, a per-address rate limit and a fixed list of commentable projects.
 */
@Service
public class ReviewService {

    /** What a visitor sends; {@code honeypot} is a hidden form field that people leave empty and bots fill. */
    public record Submission(String projectKey, String name, String text, Integer rating, String honeypot) {
    }

    private final ReviewRepository reviews;
    private final SubmissionLimiter limiter;
    private final Notifier notifier;
    private final Set<String> projects;
    private final Clock clock;

    @Autowired
    public ReviewService(ReviewRepository reviews, SubmissionLimiter limiter, Notifier notifier,
                         @Value("${app.reviews.projects}") String projects) {
        this(reviews, limiter, notifier, parseList(projects), Clock.systemUTC());
    }

    ReviewService(ReviewRepository reviews, SubmissionLimiter limiter, Notifier notifier, Set<String> projects,
                  Clock clock) {
        this.reviews = reviews;
        this.limiter = limiter;
        this.notifier = notifier;
        this.projects = Set.copyOf(projects);
        this.clock = clock;
    }

    /**
     * Stores a pending review. A filled honeypot is accepted silently and dropped, so bots get no signal.
     *
     * @throws BadRequestException     the project does not accept reviews
     * @throws ResponseStatusException 429 when the address exceeded the hourly limit
     */
    @Transactional
    public void submit(Submission submission, String clientAddress) {
        if (submission.honeypot() != null && !submission.honeypot().isBlank()) {
            return;
        }
        if (!projects.contains(submission.projectKey())) {
            throw new BadRequestException("Unknown project");
        }
        if (!limiter.tryAcquire(clientAddress)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many comments, try again later");
        }
        String text = ReviewRules.normalise(submission.text());
        String name = ReviewRules.normalise(submission.name()).replace('\n', ' ');
        if (name.isEmpty() || text.length() < ReviewRules.MIN_TEXT) {
            throw new BadRequestException("Name and comment are required");
        }
        reviews.save(Review.builder()
                .projectKey(submission.projectKey())
                .authorName(name)
                .text(text)
                .rating(submission.rating())
                .status(ReviewStatus.PENDING)
                .createdAt(clock.instant())
                .build());
        notifier.send("Portfolio: new comment on " + submission.projectKey(),
                name + " commented on " + submission.projectKey()
                        + (submission.rating() != null ? " (" + submission.rating() + "/5)" : "") + ":\n\n" + text
                        + "\n\nIt waits for your approval in the admin panel of the site.",
                null);
    }

    @Transactional(readOnly = true)
    public List<Review> approved(String projectKey) {
        return reviews.findByProjectKeyAndStatusOrderByCreatedAtDesc(projectKey, ReviewStatus.APPROVED);
    }

    @Transactional(readOnly = true)
    public List<Review> withStatus(ReviewStatus status) {
        return reviews.findByStatusOrderByCreatedAtAsc(status);
    }

    @Transactional
    public Review moderate(long id, ReviewStatus status) {
        Review review = reviews.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setStatus(status);
        review.setModeratedAt(clock.instant());
        return review;
    }

    @Transactional
    public void delete(long id) {
        if (!reviews.existsById(id)) {
            throw new ResourceNotFoundException("Review not found");
        }
        reviews.deleteById(id);
    }

    private static Set<String> parseList(String csv) {
        return Arrays.stream(csv.split(",")).map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toSet());
    }
}
