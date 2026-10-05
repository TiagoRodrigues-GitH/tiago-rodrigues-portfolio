package org.example.reviews;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.example.dto.response.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

/** Public endpoints: read approved reviews of a project, submit a review for moderation. */
@RestController
@RequestMapping("/api/reviews")
@Validated
public class ReviewController {

    public record ReviewRequest(
            @NotBlank @Pattern(regexp = ReviewRules.PROJECT_KEY_PATTERN) String project,
            @NotBlank @Size(max = ReviewRules.MAX_NAME) String name,
            @NotBlank @Size(min = ReviewRules.MIN_TEXT, max = ReviewRules.MAX_TEXT) String text,
            @Min(1) @Max(5) Integer rating,
            @Size(max = 200) String website) {
    }

    public record ReviewView(long id, String project, String name, String text, Integer rating, Instant createdAt) {
        static ReviewView of(Review review) {
            return new ReviewView(review.getId(), review.getProjectKey(), review.getAuthorName(), review.getText(),
                    review.getRating(), review.getCreatedAt());
        }
    }

    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }

    @GetMapping
    public List<ReviewView> approved(@RequestParam @Pattern(regexp = ReviewRules.PROJECT_KEY_PATTERN) String project) {
        return service.approved(project).stream().map(ReviewView::of).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public MessageResponse submit(@Valid @RequestBody ReviewRequest request, HttpServletRequest http) {
        service.submit(new ReviewService.Submission(request.project(), request.name(), request.text(),
                request.rating(), request.website()), http.getRemoteAddr());
        return new MessageResponse("Thank you. Your comment will appear after moderation.");
    }
}
