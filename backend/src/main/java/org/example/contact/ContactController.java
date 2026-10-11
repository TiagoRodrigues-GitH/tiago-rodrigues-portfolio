package org.example.contact;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.example.dto.response.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Public endpoint of the contact form. */
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    public record ContactRequest(
            @NotBlank @Size(max = ContactRules.MAX_NAME) String name,
            @NotBlank @Size(max = ContactRules.MAX_EMAIL) String email,
            @NotBlank @Size(min = ContactRules.MIN_MESSAGE, max = ContactRules.MAX_MESSAGE) String message,
            @Size(max = 200) String website) {
    }

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public MessageResponse submit(@Valid @RequestBody ContactRequest request, HttpServletRequest http) {
        service.submit(new ContactService.Submission(request.name(), request.email(), request.message(),
                request.website()), http.getRemoteAddr());
        return new MessageResponse("Thank you. Your message was sent.");
    }
}
