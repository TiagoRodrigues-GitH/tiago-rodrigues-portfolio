package org.example.contact;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * A message sent through the contact form. The e-mail address is stored only so the owner can reply; the IP
 * address is never stored (it is used in memory for the rate limit only). Deleted after the retention period.
 */
@Entity
@Table(name = "messages", indexes = @Index(name = "idx_messages_received_at", columnList = "received_at"))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = ContactRules.MAX_NAME)
    private String name;

    @Column(nullable = false, length = ContactRules.MAX_EMAIL)
    private String email;

    @Column(nullable = false, length = ContactRules.MAX_MESSAGE)
    private String message;

    @Column(name = "is_read", nullable = false)
    private boolean read;

    @Column(name = "received_at", nullable = false)
    private Instant receivedAt;
}
