package org.example.reviews;

import java.util.regex.Pattern;

/** Limits and text normalisation shared by the entity, the request validation and the service. */
public final class ReviewRules {

    public static final int MAX_PROJECT_KEY = 60;
    public static final int MAX_NAME = 60;
    public static final int MIN_TEXT = 3;
    public static final int MAX_TEXT = 1000;
    public static final String PROJECT_KEY_PATTERN = "[a-z0-9-]{1," + MAX_PROJECT_KEY + "}";

    /** Control characters except line breaks and tabs (tabs are collapsed with the spaces below). */
    private static final Pattern CONTROL = Pattern.compile("[\\p{Cntrl}&&[^\\n\\t]]");
    private static final Pattern SPACES = Pattern.compile("[ \\t]+");
    private static final Pattern BLANK_LINES = Pattern.compile("\\n{3,}");

    private ReviewRules() {
    }

    /**
     * Removes control characters (keeping line breaks), collapses runs of spaces and of blank lines, and trims.
     * The text is stored and served as plain text; the site renders it as text, never as HTML.
     */
    public static String normalise(String raw) {
        String text = raw.replace("\r\n", "\n").replace('\r', '\n');
        text = CONTROL.matcher(text).replaceAll("");
        text = SPACES.matcher(text).replaceAll(" ");
        text = BLANK_LINES.matcher(text).replaceAll("\n\n");
        return text.strip();
    }
}
