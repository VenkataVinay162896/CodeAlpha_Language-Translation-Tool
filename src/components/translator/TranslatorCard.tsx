import { useState, useCallback } from "react";
import {
  SOURCE_LANGUAGES,
  TARGET_LANGUAGES,
  languageName,
} from "@/lib/translator/languages";
import { translate } from "@/lib/translator/translate";
import { addEntry, type HistoryEntry } from "@/lib/translator/history";
import { LanguageSelect } from "./LanguageSelect";

const MAX_CHARS = 5000;

type Props = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
  // Allows the history panel to push an entry back into the editor.
  bootstrap?: { input: string; output: string; source: string; target: string } | null;
};

export function TranslatorCard({ onHistoryChange, bootstrap }: Props) {
  const [input, setInput] = useState(bootstrap?.input ?? "");
  const [output, setOutput] = useState(bootstrap?.output ?? "");
  const [source, setSource] = useState(bootstrap?.source ?? "auto");
  const [target, setTarget] = useState(bootstrap?.target ?? "en");
  const [detected, setDetected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const overLimit = input.length > MAX_CHARS;
  const canTranslate = input.trim().length > 0 && !overLimit && !loading;

  // ----- Event handlers -----

  /** Calls the translation API and updates the output / history. */
  const handleTranslate = useCallback(async () => {
    if (!canTranslate) return;
    setLoading(true);
    setError(null);
    setDetected(null);
    try {
      const result = await translate(input, source, target);
      setOutput(result.text);
      setDetected(result.detectedSource);
      const list = addEntry({
        source,
        target,
        input,
        output: result.text,
      });
      onHistoryChange(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed.");
    } finally {
      setLoading(false);
    }
  }, [canTranslate, input, source, target, onHistoryChange]);

  /** Clears both input and output. */
  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setDetected(null);
  };

  /** Swap source ↔ target (if source is "auto", use detected language). */
  const handleSwap = () => {
    const newSource = source === "auto" ? detected ?? target : source;
    setSource(target);
    setTarget(newSource);
    setInput(output);
    setOutput(input);
  };

  /** Copy translated text to clipboard. */
  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not copy to clipboard.");
    }
  };

  /** Download translated text as a .txt file. */
  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translation-${target}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      {/* Language selectors */}
      <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <LanguageSelect
          id="source-lang"
          label="From"
          value={source}
          onChange={setSource}
          options={SOURCE_LANGUAGES}
        />
        <div className="flex justify-center sm:pb-1">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap languages"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all hover:rotate-180 hover:border-ring hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 16V4M7 4 3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4" />
            </svg>
          </button>
        </div>
        <LanguageSelect
          id="target-lang"
          label="To"
          value={target}
          onChange={setTarget}
          options={TARGET_LANGUAGES}
        />
      </div>

      {/* Input / output panes */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text to translate…"
            rows={8}
            className="w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed shadow-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          />
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {source === "auto" && detected
                ? `Detected: ${languageName(detected)}`
                : "\u00A0"}
            </span>
            <span
              className={
                overLimit ? "font-medium text-destructive" : "text-muted-foreground"
              }
            >
              {input.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <div
            aria-live="polite"
            className="relative min-h-[12rem] w-full whitespace-pre-wrap rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground"
          >
            {loading ? (
              <div className="flex h-full items-center gap-2 text-muted-foreground">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Translating…
              </div>
            ) : output ? (
              output
            ) : (
              <span className="text-muted-foreground">
                Translation will appear here.
              </span>
            )}
          </div>
          <div className="mt-1.5 flex h-4 items-center justify-end text-xs">
            {copied && <span className="text-primary">Copied!</span>}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={handleTranslate}
          disabled={!canTranslate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm"
        >
          {loading ? "Translating…" : "Translate"}
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Clear
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Copy
        </button>
        <button
          onClick={handleDownload}
          disabled={!output}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download .txt
        </button>
      </div>
    </div>
  );
}
