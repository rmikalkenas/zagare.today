import { useEffect, useId, useRef, useState } from "react";
import { CATEGORY_KEYS, type Category } from "../data/points";
import CategoryList from "./CategoryList";

interface Props {
  active: Set<Category>;
  onToggle: (c: Category) => void;
  onReset: () => void;
  visibleCount: number;
  totalCount: number;
}

export default function MobileFilterSheet({
  active,
  onToggle,
  onReset,
  visibleCount,
  totalCount,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const allOn = active.size === CATEGORY_KEYS.length;

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [mounted]);

  const handlePanelAnimationEnd = () => {
    if (!open) setMounted(false);
  };

  const handleToggle = (c: Category) => {
    onToggle(c);
    setOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="md:hidden absolute top-3 right-3 z-[1100] inline-flex items-center gap-2.5 min-h-[44px] border border-ink bg-paper px-4 shadow-[0_10px_24px_-10px_rgba(20,18,16,0.55)] transition-colors hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper"
      >
        <span className="meta text-current">Filtrai</span>
        {!allOn && (
          <span className="font-mono text-[11px] tabular-nums text-current">
            {String(visibleCount).padStart(2, "0")} /{" "}
            {String(totalCount).padStart(2, "0")}
          </span>
        )}
      </button>

      {mounted && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="md:hidden fixed inset-0 z-[2000]"
        >
          <div
            onClick={() => setOpen(false)}
            className={`absolute inset-0 bg-ink/45 ${
              open
                ? "animate-[fadeIn_180ms_ease-out]"
                : "animate-[fadeOut_220ms_ease-out_forwards]"
            }`}
          />

          <div
            onAnimationEnd={handlePanelAnimationEnd}
            className={`absolute inset-x-0 bottom-0 max-h-[80dvh] flex flex-col border-t border-ink bg-paper ${
              open
                ? "animate-[slideUp_260ms_cubic-bezier(0.22,1,0.36,1)]"
                : "animate-[slideDown_220ms_cubic-bezier(0.55,0,0.78,0)_forwards]"
            }`}
          >
            <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-ink/15 shrink-0">
              <div>
                <h2
                  id={titleId}
                  className="font-display text-2xl leading-none text-ink"
                >
                  Filtrai
                </h2>
                <p className="meta mt-2">
                  Rodoma{" "}
                  <span className="text-ink tabular-nums">
                    {String(visibleCount).padStart(2, "0")}
                  </span>
                  {" / "}
                  <span className="tabular-nums">
                    {String(totalCount).padStart(2, "0")}
                  </span>{" "}
                  taškų
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Uždaryti"
                className="-mr-2 -mt-2 shrink-0 inline-flex h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-ink focus-visible:text-ink"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M2 2 L14 14 M14 2 L2 14" />
                </svg>
              </button>
            </header>

            <div className="flex justify-end px-5 pt-3 shrink-0 min-h-[14px]">
              {!allOn && (
                <button type="button" onClick={onReset} className="meta-link">
                  Rodyti viską
                </button>
              )}
            </div>

            <CategoryList
              active={active}
              onToggle={handleToggle}
              className="min-h-0 overflow-y-auto px-5 pb-[max(env(safe-area-inset-bottom),20px)] mt-2"
            />
          </div>
        </div>
      )}
    </>
  );
}
