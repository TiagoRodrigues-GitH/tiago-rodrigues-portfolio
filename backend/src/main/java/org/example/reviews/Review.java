package org.example.reviews;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
 * A visitor's comment on a project. Only the name the visitor chose, the text and an optional 1-5 rating are
 * stored: no e-mail and no IP address (data minimisation, LGPD art. 6, III).
 */
@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_reviews_project_status", columnList = "project_key, status"),
        @Index(name = "idx_reviews_status", columnList = "status")})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_key", nullable = false, length = ReviewRules.MAX_PROJECT_KEY)
    private String projectKey;

    @Column(name = "author_name", nullable = false, length = ReviewRules.MAX_NAME)
    private String authorName;

    @Column(nullable = false, length = ReviewRules.MAX_TEXT)
    private String text;

    /** Optional, 1 to 5. */
    private Integer rating;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ReviewStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "moderated_at")
    private Instant moderatedAt;
}
