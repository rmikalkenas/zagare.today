import { useEffect, useRef, useState, type RefObject } from "react";

interface Options {
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

interface DialogState<T extends HTMLElement> {
  open: boolean;
  mounted: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  dialogRef: RefObject<T | null>;
  onAnimationEnd: () => void;
}

// `open` is the intent flag (drives slide-in vs. slide-out classes); `mounted`
// keeps the dialog in the DOM through the slide-out animation. Unmount happens
// in `onAnimationEnd` once `open` is already false.
export function useDialog<T extends HTMLElement = HTMLElement>(
  options: Options = {},
): DialogState<T> {
  const { initialFocusRef, returnFocusRef } = options;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<T | null>(null);

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
    initialFocusRef?.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      returnFocusRef?.current?.focus();
    };
  }, [mounted, initialFocusRef, returnFocusRef]);

  return {
    open,
    mounted,
    openDialog: () => setOpen(true),
    closeDialog: () => setOpen(false),
    dialogRef,
    onAnimationEnd: () => {
      if (!open) setMounted(false);
    },
  };
}
