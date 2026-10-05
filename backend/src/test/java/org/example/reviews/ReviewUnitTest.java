package org.example.reviews;

import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

class ReviewUnitTest {

    /** A clock the test moves forward by hand. */
    private static final class TestClock extends Clock {
        private Instant now = Instant.parse("2026-10-05T12:00:00Z");

        void advance(Duration d) {
            now = now.plus(d);
        }

        @Override
        public Instant instant() {
            return now;
        }

        @Override
        public java.time.ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(java.time.ZoneId zone) {
            return this;
        }
    }

    @Test
    void normaliseKeepsLineBreaksAndDropsControlCharacters() {
        assertThat(ReviewRules.normalise("  Hello\u0007   world\r\n\r\n\r\n\r\nBye\t\t! "))
                .isEqualTo("Hello world\n\nBye !");
    }

    @Test
    void limiterAllowsUpToTheLimitPerWindowAndPerAddress() {
        TestClock clock = new TestClock();
        SubmissionLimiter limiter = new SubmissionLimiter(2, clock);

        assertThat(limiter.tryAcquire("a")).isTrue();
        assertThat(limiter.tryAcquire("a")).isTrue();
        assertThat(limiter.tryAcquire("a")).isFalse();
        assertThat(limiter.tryAcquire("b")).isTrue();

        clock.advance(SubmissionLimiter.WINDOW.plusSeconds(1));
        assertThat(limiter.tryAcquire("a")).isTrue();
    }
}
