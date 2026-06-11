import type { HistoryEntry } from "@/lib/translator/history";
import { languageName } from "@/lib/translator/languages";

type Props = {
  entries: HistoryEntry[];
  onPick: (e: HistoryEntry) => void;
  onClear: () => void;
};

export function HistoryPanel({ entries, onPick, onClear }: Props) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
        Your recent translations will appear here.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Recent translations</h3>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground transition-colors hover:text-destructive"
        >
          Clear
        </button>
      </div>
      <ul className="divide-y divide-border">
        {entries.map((e) => (
          <li key={e.id}>
            <button
              onClick={() => onPick(e)}
              className="block w-full px-4 py-3 text-left transition-colors hover:bg-accent"
            >
              <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {languageName(e.source)} → {languageName(e.target)}
              </div>
              <div className="line-clamp-1 text-sm text-foreground">{e.input}</div>
              <div className="line-clamp-1 text-sm text-muted-foreground">
                {e.output}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
