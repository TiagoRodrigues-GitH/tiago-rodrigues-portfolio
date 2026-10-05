package org.example.reviews;

/** Moderation state of a review: only {@link #APPROVED} reviews are shown on the site. */
public enum ReviewStatus {
    PENDING,
    APPROVED,
    REJECTED
}
