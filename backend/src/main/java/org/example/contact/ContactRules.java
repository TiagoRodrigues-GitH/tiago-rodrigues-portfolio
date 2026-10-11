package org.example.contact;

/** Limits shared by the entity, the request validation and the site's form hints (contact.service.ts). */
public final class ContactRules {

    public static final int MAX_NAME = 100;
    public static final int MAX_EMAIL = 200;
    public static final int MIN_MESSAGE = 10;
    public static final int MAX_MESSAGE = 5000;

    private ContactRules() {
    }
}
