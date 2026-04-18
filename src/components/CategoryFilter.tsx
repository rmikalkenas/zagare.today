import {
  CATEGORIES,
  CATEGORY_COUNTS,
  CATEGORY_KEYS,
  type Category,
} from "../data/points";

interface Props {
  active: Set<Category>;
  onToggle: (c: Category) => void;
  onReset: () => void;
}

export default function CategoryFilter({ active, onToggle, onReset }: Props) {
  const allOn = active.size === CATEGORY_KEYS.length;

  return (
    <aside className="md:col-span-4 lg:col-span-3 order-2 md:order-1 flex flex-col">
      <div className="flex justify-end mb-4 min-h-[14px]">
        {!allOn && (
          <button type="button" onClick={onReset} className="meta-link">
            Rodyti viską
          </button>
        )}
      </div>

      <ul className="divide-y divide-ink/15 border-y border-ink/15">
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
                  className="h-3 w-3 shrink-0 border-[1.5px] transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: on ? color : "transparent",
                    borderColor: color,
                  }}
                />
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
    </aside>
  );
}
