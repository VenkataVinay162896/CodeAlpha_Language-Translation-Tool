// Thin wrapper around the unofficial Google Translate "gtx" endpoint.
// No API key required; called directly from the browser (CORS allowed).

export type TranslateResult = {
  text: string;
  detectedSource: string | null;
};

const ENDPOINT = "https://translate.googleapis.com/translate_a/single";

/**
 * Translate `text` from `source` (or "auto") into `target`.
 * Throws a typed Error on network / parse failures so the UI can show it.
 */
export async function translate(
  text: string,
  source: string,
  target: string,
): Promise<TranslateResult> {
  const params = new URLSearchParams({
    client: "gtx",
    sl: source || "auto",
    tl: target,
    dt: "t",
    q: text,
  });

  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}?${params.toString()}`);
  } catch {
    throw new Error("Network error — please check your connection.");
  }

  if (!res.ok) {
    throw new Error(`Translation failed (HTTP ${res.status}).`);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected response from translation service.");
  }

  // Response shape: [[[ "segment", "orig", ... ], ...], null, "detectedLang", ...]
  const arr = data as unknown[];
  const segments = arr?.[0] as unknown[] | undefined;
  if (!Array.isArray(segments)) {
    throw new Error("Could not parse translation response.");
  }

  const translated = segments
    .map((s) => (Array.isArray(s) ? (s[0] as string) ?? "" : ""))
    .join("");

  const detectedSource =
    typeof arr[2] === "string" ? (arr[2] as string) : null;

  return { text: translated, detectedSource };
}
