package org.example.notify;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

class NotifierTest {

    @Test
    void offUntilBothKeyAndRecipientAreSet() {
        ObjectMapper json = new ObjectMapper();
        assertThat(new Notifier(json, "", "", "Portfolio <onboarding@resend.dev>").enabled()).isFalse();
        assertThat(new Notifier(json, "re_key", " ", "Portfolio <onboarding@resend.dev>").enabled()).isFalse();
        assertThat(new Notifier(json, "re_key", "me@example.org", "Portfolio <onboarding@resend.dev>").enabled()).isTrue();
    }

    @Test
    void sendingWhileOffDoesNothing() {
        Notifier off = new Notifier(new ObjectMapper(), "", "", "Portfolio <onboarding@resend.dev>");
        assertThatCode(() -> off.send("subject", "text", "visitor@example.org")).doesNotThrowAnyException();
    }
}
