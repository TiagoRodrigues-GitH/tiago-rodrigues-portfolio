package org.example.reviews;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** The review flow end to end, through the security chain: submit -> pending -> approve -> public. */
@SpringBootTest(properties = {
        "app.jwt.secret=MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=",
        "app.cors.allowed-origins=https://tiagorodrigues-gith.github.io",
        "app.reviews.projects=compact-llm,vehicle-management",
        "app.reviews.max-per-hour=3",
})
@AutoConfigureMockMvc
class ReviewApiTest {

    private static final RequestPostProcessor ADMIN = jwt().authorities(new SimpleGrantedAuthority("SCOPE_ADMIN"));

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper json;

    @Autowired
    private ReviewRepository reviews;

    @BeforeEach
    void clean() {
        reviews.deleteAll();
    }

    private ResultActions submit(Map<String, Object> body, String address) throws Exception {
        return mvc.perform(post("/api/reviews").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(body))
                .with(request -> {
                    request.setRemoteAddr(address);
                    return request;
                }));
    }

    private static Map<String, Object> review(String project, String text) {
        return Map.of("project", project, "name", "Ana", "text", text, "rating", 5);
    }

    @Test
    void submittedReviewIsHiddenUntilApproved() throws Exception {
        submit(review("compact-llm", "  Very   clear demo!  "), "10.0.0.1").andExpect(status().isAccepted());

        mvc.perform(get("/api/reviews").param("project", "compact-llm"))
                .andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(0)));

        long id = reviews.findAll().get(0).getId();
        mvc.perform(put("/api/admin/reviews/{id}/status", id).with(ADMIN)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"APPROVED\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("APPROVED"));

        mvc.perform(get("/api/reviews").param("project", "compact-llm"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].text").value("Very clear demo!"))
                .andExpect(jsonPath("$[0].name").value("Ana"))
                .andExpect(jsonPath("$[0].rating").value(5));
    }

    @Test
    void honeypotSubmissionIsAcceptedButNotStored() throws Exception {
        Map<String, Object> bot = Map.of("project", "compact-llm", "name", "Bot", "text", "buy now",
                "website", "http://spam.example");
        submit(bot, "10.0.0.2").andExpect(status().isAccepted());
        org.assertj.core.api.Assertions.assertThat(reviews.count()).isZero();
    }

    @Test
    void unknownProjectAndInvalidFieldsAreRejected() throws Exception {
        submit(review("not-a-project", "Nice"), "10.0.0.3").andExpect(status().isBadRequest());
        submit(review("compact-llm", "x"), "10.0.0.3").andExpect(status().isBadRequest());
        submit(Map.of("project", "compact-llm", "name", "Ana", "text", "Fine", "rating", 9), "10.0.0.3")
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/reviews").param("project", "Bad Key!")).andExpect(status().isBadRequest());
    }

    @Test
    void addressIsLimitedPerHour() throws Exception {
        for (int i = 0; i < 3; i++) {
            submit(review("vehicle-management", "Comment " + i), "10.0.0.4").andExpect(status().isAccepted());
        }
        submit(review("vehicle-management", "One too many"), "10.0.0.4").andExpect(status().isTooManyRequests());
        submit(review("vehicle-management", "Other visitor"), "10.0.0.5").andExpect(status().isAccepted());
    }

    @Test
    void moderationNeedsAdmin() throws Exception {
        mvc.perform(get("/api/admin/reviews")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/reviews").with(jwt())).andExpect(status().isForbidden());
        mvc.perform(get("/api/admin/reviews").with(ADMIN)).andExpect(status().isOk());
        mvc.perform(get("/api/admin/reviews").param("status", "WRONG").with(ADMIN)).andExpect(status().isBadRequest());
    }

    @Test
    void adminListsPendingAndDeletes() throws Exception {
        submit(review("compact-llm", "Pending one"), "10.0.0.6").andExpect(status().isAccepted());
        long id = reviews.findAll().get(0).getId();

        mvc.perform(get("/api/admin/reviews").with(ADMIN))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].status").value("PENDING"));
        mvc.perform(delete("/api/admin/reviews/{id}", id).with(ADMIN)).andExpect(status().isNoContent());
        mvc.perform(delete("/api/admin/reviews/{id}", id).with(ADMIN)).andExpect(status().isNotFound());
    }
}
