import {
  CATEGORIES,
  CATEGORY_COUNTS,
  CATEGORY_KEYS,
  type Category,
} from "../data/points";
import CategoryGlyph from "./CategoryGlyph";

interface Props {
  active: Set<Category>;
  onToggle: (c: Category) => void;
  className?: string;
}

export default function CategoryList({ active, onToggle, className }: Props) {
  return (
    <ul className={`divide-y divide-ink/15 ${className ?? ""}`.trimEnd()}>
      {CATEGORY_KEYS.map((c) => {
        const { label, color } = CATEGORIES[c];
        const on = active.has(c);
        return (
          <li key={c}>
            <button
              type="button"
              onClick={() => onToggle(c)}
              aria-pressed={on}
              className="group w-full flex items-center gap-3 py-4 text-left"
            >
              <span className="font-mono text-[10px] tabular-nums tracking-wider text-ink-soft w-5 shrink-0">
                {String(CATEGORY_COUNTS[c]).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className="h-4 w-4 shrink-0 inline-flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ color, opacity: on ? 1 : 0.4 }}
              >
                <CategoryGlyph category={c} />
              </span>
              <span
                className={`flex-1 font-sans text-[13px] font-medium uppercase tracking-[0.14em] transition-colors ${
                  on ? "text-ink" : "text-ink-soft"
                }`}
              >
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
