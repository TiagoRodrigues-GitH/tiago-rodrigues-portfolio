package org.example.contact;

import org.example.notify.Notifier;
import org.example.reviews.SubmissionLimiter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

/** LGPD retention: the daily job deletes messages older than the retention period and keeps the rest. */
@DataJpaTest
class ContactRetentionTest {

    private static final Instant NOW = Instant.parse("2026-10-11T12:00:00Z");

    @Autowired
    private ContactMessageRepository messages;

    @Autowired
    private TestEntityManager entities;

    private ContactMessage receivedDaysAgo(long days) {
        return messages.save(ContactMessage.builder().name("Ana").email("ana@example.org")
                .message("Hello, a message for the test.").read(true).receivedAt(NOW.minus(Duration.ofDays(days)))
                .build());
    }

    @Test
    void purgeDeletesOnlyMessagesPastRetention() {
        ContactMessage old = receivedDaysAgo(400);
        ContactMessage recent = receivedDaysAgo(10);
        ContactService service = new ContactService(messages, new SubmissionLimiter(3), mock(Notifier.class),
                Clock.fixed(NOW, ZoneOffset.UTC), Duration.ofDays(365));

        service.purgeOld();
        entities.clear(); // the bulk delete bypasses the persistence context: read from the database again

        assertThat(messages.findById(old.getId())).isEmpty();
        assertThat(messages.findById(recent.getId())).isPresent();
    }
}
