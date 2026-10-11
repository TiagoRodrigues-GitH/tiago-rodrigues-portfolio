package org.example.contact;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

/** Inbox of contact messages, ADMIN only (secured by the /api/admin/** rule in SecurityConfig). */
@RestController
@RequestMapping("/api/admin/messages")
public class ContactAdminController {

    public record ReadChange(boolean read) {
    }

    public record MessageView(long id, String name, String email, String message, boolean read, Instant receivedAt) {
        static MessageView of(ContactMessage m) {
            return new MessageView(m.getId(), m.getName(), m.getEmail(), m.getMessage(), m.isRead(), m.getReceivedAt());
        }
    }

    public record Unread(long unread) {
    }

    private final ContactService service;

    public ContactAdminController(ContactService service) {
        this.service = service;
    }

    @GetMapping
    public List<MessageView> list() {
        return service.all().stream().map(MessageView::of).toList();
    }

    @GetMapping("/unread")
    public Unread unread() {
        return new Unread(service.unread());
    }

    @PutMapping("/{id}/read")
    public MessageView markRead(@PathVariable long id, @RequestBody ReadChange change) {
        return MessageView.of(service.markRead(id, change.read()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        service.delete(id);
    }
}
