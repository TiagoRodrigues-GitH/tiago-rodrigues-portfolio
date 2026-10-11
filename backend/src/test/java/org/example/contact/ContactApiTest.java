package org.example.contact;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.notify.Notifier;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** The contact flow end to end, through the security chain: submit -> inbox -> read -> delete. */
@SpringBootTest(properties = {
        "app.jwt.secret=MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=",
        "app.cors.allowed-origins=https://tiagorodrigues-gith.github.io",
        "app.contact.max-per-hour=2",
})
@AutoConfigureMockMvc
class ContactApiTest {

    private static final RequestPostProcessor ADMIN = jwt().authorities(new SimpleGrantedAuthority("SCOPE_ADMIN"));

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper json;

    @Autowired
    private ContactMessageRepository messages;

    @MockitoBean
    private Notifier notifier;

    @BeforeEach
    void clean() {
        messages.deleteAll();
    }

    private ResultActions submit(Map<String, Object> body, String address) throws Exception {
        return mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(body))
                .with(request -> {
                    request.setRemoteAddr(address);
                    return request;
                }));
    }

    private static Map<String, Object> message(String text) {
        return Map.of("name", "Ana Recruiter", "email", "ana@example.org", "message", text);
    }

    @Test
    void messageReachesTheInboxAndTheOwnerIsAlerted() throws Exception {
        submit(message("  Hello Tiago,   we have a Java position.  "), "10.1.0.1").andExpect(status().isAccepted());

        mvc.perform(get("/api/admin/messages").with(ADMIN))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Ana Recruiter"))
                .andExpect(jsonPath("$[0].email").value("ana@example.org"))
                .andExpect(jsonPath("$[0].message").value("Hello Tiago, we have a Java position."))
                .andExpect(jsonPath("$[0].read").value(false));
        mvc.perform(get("/api/admin/messages/unread").with(ADMIN)).andExpect(jsonPath("$.unread").value(1));
        // The alert lets the owner reply straight to the visitor.
        verify(notifier).send(contains("Ana Recruiter"), contains("Java position"), eq("ana@example.org"));
    }

    @Test
    void honeypotIsAcceptedButNotStoredOrForwarded() throws Exception {
        submit(Map.of("name", "Bot", "email", "bot@spam.example", "message", "Cheap watches here!!",
                "website", "http://spam.example"), "10.1.0.2").andExpect(status().isAccepted());
        assertThat(messages.count()).isZero();
        verify(notifier, never()).send(anyString(), anyString(), anyString());
    }

    @Test
    void invalidFieldsAreRejected() throws Exception {
        submit(message("too short"), "10.1.0.3").andExpect(status().isBadRequest());
        submit(Map.of("name", "Ana", "email", "not-an-email", "message", "A long enough message."), "10.1.0.3")
                .andExpect(status().isBadRequest());
        submit(Map.of("email", "ana@example.org", "message", "A long enough message."), "10.1.0.3")
                .andExpect(status().isBadRequest());
        assertThat(messages.count()).isZero();
    }

    @Test
    void addressIsLimitedPerHour() throws Exception {
        submit(message("First message, long enough."), "10.1.0.4").andExpect(status().isAccepted());
        submit(message("Second message, long enough."), "10.1.0.4").andExpect(status().isAccepted());
        submit(message("Third message, one too many."), "10.1.0.4").andExpect(status().isTooManyRequests());
        submit(message("Another visitor, long enough."), "10.1.0.5").andExpect(status().isAccepted());
    }

    @Test
    void inboxNeedsAdminAndSupportsReadAndDelete() throws Exception {
        mvc.perform(get("/api/admin/messages")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/messages").with(jwt())).andExpect(status().isForbidden());

        submit(message("Please call me back tomorrow."), "10.1.0.6").andExpect(status().isAccepted());
        long id = messages.findAll().get(0).getId();

        mvc.perform(put("/api/admin/messages/{id}/read", id).with(ADMIN)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"read\":true}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.read").value(true));
        mvc.perform(get("/api/admin/messages/unread").with(ADMIN)).andExpect(jsonPath("$.unread").value(0));
        mvc.perform(delete("/api/admin/messages/{id}", id).with(ADMIN)).andExpect(status().isNoContent());
        mvc.perform(delete("/api/admin/messages/{id}", id).with(ADMIN)).andExpect(status().isNotFound());
    }
}
