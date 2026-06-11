import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import {
  clearHistory,
  getHistory,
  type HistoryEntry,
} from "@/lib/translator/history";
import { TranslatorCard } from "./TranslatorCard";
import { HistoryPanel } from "./HistoryPanel";

export function TranslatorPage() {
  const { theme, toggle } = useTheme();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [bootstrap, setBootstrap] = useState<{
    input: string;
    output: string;
    source: string;
    target: string;
  } | null>(null);
  // Keys remount the card when an entry is loaded from history.
  const [cardKey, setCardKey] = useState(0);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handlePick = (e: HistoryEntry) => {
    setBootstrap({
      input: e.input,
      output: e.output,
      source: e.source,
      target: e.target,
    });
    setCardKey((k) => k + 1);
  };

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Translator
            </div>
            <h1 className="truncate text-3xl font-bold tracking-tight sm:text-4xl">
              Language Translation Tool
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Fast, free translation across 25+ languages — powered by Google
              Translate.
            </p>
          </div>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent"
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              </svg>
            )}
          </button>
        </header>

        {/* Main card */}
        <TranslatorCard
          key={cardKey}
          onHistoryChange={setHistory}
          bootstrap={bootstrap}
        />

        {/* History */}
        <section className="mt-8">
          <HistoryPanel
            entries={history}
            onPick={handlePick}
            onClear={handleClear}
          />
        </section>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Translations are processed in your browser. History is saved locally.
        </footer>
      </div>
    </div>
  );
}
