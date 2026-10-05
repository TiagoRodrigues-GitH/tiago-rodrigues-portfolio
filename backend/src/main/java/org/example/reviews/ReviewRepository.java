package org.example.reviews;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProjectKeyAndStatusOrderByCreatedAtDesc(String projectKey, ReviewStatus status);

    List<Review> findByStatusOrderByCreatedAtAsc(ReviewStatus status);
}
