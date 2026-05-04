import { CATEGORY_KEYS, type Category } from "../data/points";
import CategoryList from "./CategoryList";

interface Props {
  active: Set<Category>;
  onToggle: (c: Category) => void;
  onReset: () => void;
}

export default function CategoryFilter({ active, onToggle, onReset }: Props) {
  const allOn = active.size === CATEGORY_KEYS.length;

  return (
    <aside className="md:col-span-4 lg:col-span-3 hidden md:flex md:order-1 flex-col">
      <div className="flex justify-end mb-4 min-h-[14px]">
        {!allOn && (
          <button type="button" onClick={onReset} className="meta-link">
            Rodyti viską
          </button>
        )}
      </div>

      <CategoryList
        active={active}
        onToggle={onToggle}
        className="border-y border-ink/15"
      />
    </aside>
  );
}
