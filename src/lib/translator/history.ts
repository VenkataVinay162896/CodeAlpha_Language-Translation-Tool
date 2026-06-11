// localStorage-backed translation history (last 10 entries).

export type HistoryEntry = {
  id: string;
  source: string;
  target: string;
  input: string;
  output: string;
  at: number;
};

const KEY = "translator-history";
const MAX = 10;

function safeWindow(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getHistory(): HistoryEntry[] {
  const ls = safeWindow();
  if (!ls) return [];
  try {
    const raw = ls.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addEntry(entry: Omit<HistoryEntry, "id" | "at">): HistoryEntry[] {
  const ls = safeWindow();
  const next: HistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: Date.now(),
  };
  const list = [next, ...getHistory()].slice(0, MAX);
  if (ls) {
    try {
      ls.setItem(KEY, JSON.stringify(list));
    } catch {
      /* ignore quota errors */
    }
  }
  return list;
}

export function clearHistory(): void {
  const ls = safeWindow();
  if (ls) ls.removeItem(KEY);
}
