package org.example.reviews;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

/** Moderation, ADMIN only (secured by the /api/admin/** rule in SecurityConfig). */
@RestController
@RequestMapping("/api/admin/reviews")
public class ReviewAdminController {

    public record StatusChange(@NotNull ReviewStatus status) {
    }

    public record AdminReviewView(long id, String project, String name, String text, Integer rating,
                                  ReviewStatus status, Instant createdAt, Instant moderatedAt) {
        static AdminReviewView of(Review review) {
            return new AdminReviewView(review.getId(), review.getProjectKey(), review.getAuthorName(),
                    review.getText(), review.getRating(), review.getStatus(), review.getCreatedAt(),
                    review.getModeratedAt());
        }
    }

    private final ReviewService service;

    public ReviewAdminController(ReviewService service) {
        this.service = service;
    }

    @GetMapping
    public List<AdminReviewView> list(@RequestParam(defaultValue = "PENDING") ReviewStatus status) {
        return service.withStatus(status).stream().map(AdminReviewView::of).toList();
    }

    @PutMapping("/{id}/status")
    public AdminReviewView moderate(@PathVariable long id, @Valid @RequestBody StatusChange change) {
        return AdminReviewView.of(service.moderate(id, change.status()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        service.delete(id);
    }
}
