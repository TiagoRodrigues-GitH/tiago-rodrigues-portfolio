package org.example.notify;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * E-mail alerts to the site owner (new contact message, new comment to moderate) through Resend's HTTP API
 * (free plan: 3,000 e-mails a month). Off unless RESEND_API_KEY and NOTIFY_EMAIL are set. Sending is asynchronous
 * and best effort: a failed alert is logged and never affects the visitor's request.
 * <p>
 * Without a verified domain Resend only accepts the sender {@code onboarding@resend.dev}, delivering to the
 * address of the Resend account itself, which is exactly the owner's inbox.
 */
@Component
public class Notifier {

    private static final Logger LOG = LoggerFactory.getLogger(Notifier.class);
    private static final URI RESEND = URI.create("https://api.resend.com/emails");

    /** Created on the first alert: with alerts off, no client thread or socket is ever opened. */
    private volatile HttpClient http;
    private final ObjectMapper json;
    private final String apiKey;
    private final String to;
    private final String from;

    public Notifier(ObjectMapper json,
                    @Value("${app.notify.resend-api-key:}") String apiKey,
                    @Value("${app.notify.to:}") String to,
                    @Value("${app.notify.from:Portfolio <onboarding@resend.dev>}") String from) {
        this.json = json;
        this.apiKey = apiKey.strip();
        this.to = to.strip();
        this.from = from.strip();
        LOG.info("E-mail alerts {}", enabled() ? "on (Resend)" : "off (RESEND_API_KEY / NOTIFY_EMAIL not set)");
    }

    public boolean enabled() {
        return !apiKey.isEmpty() && !to.isEmpty();
    }

    /**
     * Sends a plain-text alert to the owner. {@code replyTo} (may be null) lets the owner answer a visitor directly.
     */
    public void send(String subject, String text, String replyTo) {
        if (!enabled()) {
            return;
        }
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("from", from);
        body.put("to", List.of(to));
        body.put("subject", subject);
        body.put("text", text);
        if (replyTo != null && !replyTo.isBlank()) {
            body.put("reply_to", replyTo);
        }
        HttpRequest request;
        try {
            request = HttpRequest.newBuilder(RESEND)
                    .timeout(Duration.ofSeconds(15))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body)))
                    .build();
        } catch (JsonProcessingException e) {
            LOG.warn("E-mail alert not sent: {}", e.getMessage());
            return;
        }
        client().sendAsync(request, HttpResponse.BodyHandlers.discarding()).whenComplete((response, error) -> {
            if (error != null) {
                LOG.warn("E-mail alert not sent: {}", error.toString());
            } else if (response.statusCode() >= 300) {
                LOG.warn("E-mail alert rejected by Resend: HTTP {}", response.statusCode());
            }
        });
    }

    private HttpClient client() {
        HttpClient client = http;
        if (client == null) {
            synchronized (this) {
                if (http == null) {
                    http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
                }
                client = http;
            }
        }
        return client;
    }
}
