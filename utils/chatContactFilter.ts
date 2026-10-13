const EMAIL_PATTERN = /[a-z0-9._%+-]+\s*(?:@|\[?at\]?|\(at\))\s*[a-z0-9.-]+\s*(?:\.|\[?dot\]?|\(dot\))\s*[a-z]{2,}/i;

// Matches UK mobiles and common landlines, allowing spaces, brackets, dots, and hyphens.
const UK_PHONE_PATTERN = /(?:\+?44\s*(?:0\s*)?|0\s*)(?:7\d|1\d|2\d)(?:[\s().-]*\d){8,9}(?!\d)/;

export const containsContactDetails = (message: string) =>
  EMAIL_PATTERN.test(message) || UK_PHONE_PATTERN.test(message);

export const CONTACT_DETAILS_MESSAGE =
  "For your safety, email addresses and telephone numbers cannot be shared in chat.";
