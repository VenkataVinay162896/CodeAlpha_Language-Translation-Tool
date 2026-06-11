// List of supported languages for the translator UI.
// Codes match Google Translate's two-letter (or locale) identifiers.
export type Language = { code: string; name: string };

export const SOURCE_LANGUAGES: Language[] = [
  { code: "auto", name: "Auto-detect" },
  ...[
    { code: "en", name: "English" },
    { code: "te", name: "Telugu" },
    { code: "ta", name: "Tamil" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "nl", name: "Dutch" },
    { code: "ru", name: "Russian" },
    { code: "pl", name: "Polish" },
    { code: "tr", name: "Turkish" },
    { code: "ar", name: "Arabic" },
    { code: "he", name: "Hebrew" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "zh-TW", name: "Chinese (Traditional)" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "vi", name: "Vietnamese" },
    { code: "th", name: "Thai" },
    { code: "id", name: "Indonesian" },
    { code: "el", name: "Greek" },
    { code: "sv", name: "Swedish" },
    { code: "uk", name: "Ukrainian" },
  ],
];

// Target languages exclude "auto" — you must pick a real target.
export const TARGET_LANGUAGES: Language[] = SOURCE_LANGUAGES.filter(
  (l) => l.code !== "auto",
);

export function languageName(code: string): string {
  return SOURCE_LANGUAGES.find((l) => l.code === code)?.name ?? code;
}
