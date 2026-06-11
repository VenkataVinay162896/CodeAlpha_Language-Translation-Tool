import type { Language } from "@/lib/translator/languages";

// Accessible native <select>, themed via existing design tokens.
type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (code: string) => void;
  options: Language[];
};

export function LanguageSelect({ id, label, value, onChange, options }: Props) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label
        htmlFor={id}
        className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm
                   shadow-sm transition-colors focus:outline-none focus:ring-2
                   focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
                   hover:border-ring/60"
      >
        {options.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
}
