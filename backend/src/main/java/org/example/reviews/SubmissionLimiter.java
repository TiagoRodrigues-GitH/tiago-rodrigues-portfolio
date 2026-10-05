package org.example.reviews;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Sliding-window limit on review submissions per client address. In memory, like the login protection: enough for
 * a single-instance portfolio. Addresses are never stored in the database.
 */
@Component
public class SubmissionLimiter {

    static final Duration WINDOW = Duration.ofHours(1);
    private static final int MAX_TRACKED_CLIENTS = 10_000;

    private final int maxPerWindow;
    private final Clock clock;
    private final Map<String, Deque<Instant>> recent = new ConcurrentHashMap<>();

    @Autowired
    public SubmissionLimiter(@Value("${app.reviews.max-per-hour:5}") int maxPerWindow) {
        this(maxPerWindow, Clock.systemUTC());
    }

    SubmissionLimiter(int maxPerWindow, Clock clock) {
        this.maxPerWindow = maxPerWindow;
        this.clock = clock;
    }

    /** Counts the attempt and returns {@code true} when the client is still within the limit. */
    public boolean tryAcquire(String client) {
        Instant now = clock.instant();
        Instant cutoff = now.minus(WINDOW);
        Deque<Instant> times = recent.computeIfAbsent(client, k -> new ArrayDeque<>());
        boolean allowed;
        synchronized (times) {
            dropOlderThan(times, cutoff);
            allowed = times.size() < maxPerWindow;
            if (allowed) {
                times.addLast(now);
            }
        }
        if (recent.size() > MAX_TRACKED_CLIENTS) {
            evictIdle(cutoff);
        }
        return allowed;
    }

    private void evictIdle(Instant cutoff) {
        recent.entrySet().removeIf(entry -> {
            Deque<Instant> times = entry.getValue();
            synchronized (times) {
                dropOlderThan(times, cutoff);
                return times.isEmpty();
            }
        });
    }

    private static void dropOlderThan(Deque<Instant> times, Instant cutoff) {
        while (!times.isEmpty() && times.peekFirst().isBefore(cutoff)) {
            times.pollFirst();
        }
    }
}
