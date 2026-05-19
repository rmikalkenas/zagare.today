// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRef } from "react";
import { useDialog } from "./useDialog";

function fireKey(key: string, opts: KeyboardEventInit = {}) {
  document.dispatchEvent(new KeyboardEvent("keydown", { key, ...opts }));
}

describe("useDialog", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    document.body.style.overflow = "";
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts closed and unmounted", () => {
    const { result } = renderHook(() => useDialog<HTMLDivElement>());
    expect(result.current.open).toBe(false);
    expect(result.current.mounted).toBe(false);
  });

  it("opens and mounts on openDialog()", () => {
    const { result } = renderHook(() => useDialog<HTMLDivElement>());
    act(() => result.current.openDialog());
    expect(result.current.open).toBe(true);
    expect(result.current.mounted).toBe(true);
  });

  it("locks and restores body scroll across full open/close lifecycle", () => {
    document.body.style.overflow = "scroll";
    const { result } = renderHook(() => useDialog<HTMLDivElement>());

    act(() => result.current.openDialog());
    expect(document.body.style.overflow).toBe("hidden");

    // closeDialog flips `open` but keeps `mounted=true` until the close
    // animation finishes - body lock holds during exit animation.
    act(() => result.current.closeDialog());
    expect(document.body.style.overflow).toBe("hidden");

    // Simulate animation end with no closeAnimationName filter: any
    // bubbled-up animation on the same target unmounts and runs cleanup.
    const el = document.createElement("div");
    act(() =>
      result.current.onAnimationEnd({
        target: el,
        currentTarget: el,
        animationName: "fadeOut",
      } as never),
    );
    expect(result.current.mounted).toBe(false);
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("Escape key closes the dialog", () => {
    const { result } = renderHook(() => useDialog<HTMLDivElement>());
    act(() => result.current.openDialog());
    expect(result.current.open).toBe(true);

    act(() => fireKey("Escape"));
    expect(result.current.open).toBe(false);
  });

  it("ignores keydown events while closed", () => {
    const { result } = renderHook(() => useDialog<HTMLDivElement>());
    act(() => fireKey("Escape"));
    expect(result.current.open).toBe(false);
    expect(result.current.mounted).toBe(false);
  });

  it("focuses initialFocusRef when opened", () => {
    const btn = document.createElement("button");
    document.body.appendChild(btn);

    const { result } = renderHook(() => {
      const initialFocusRef = useRef<HTMLButtonElement>(btn);
      return {
        ...useDialog<HTMLDivElement>({ initialFocusRef }),
        initialFocusRef,
      };
    });

    act(() => result.current.openDialog());
    expect(document.activeElement).toBe(btn);
  });

  it("returns focus to returnFocusRef after full close lifecycle", () => {
    const trigger = document.createElement("button");
    const inside = document.createElement("button");
    document.body.append(trigger, inside);
    trigger.focus();

    const { result } = renderHook(() => {
      const initialFocusRef = useRef<HTMLButtonElement>(inside);
      const returnFocusRef = useRef<HTMLButtonElement>(trigger);
      return useDialog<HTMLDivElement>({ initialFocusRef, returnFocusRef });
    });

    act(() => result.current.openDialog());
    expect(document.activeElement).toBe(inside);

    act(() => result.current.closeDialog());
    // Cleanup runs when `mounted` flips false, not on close alone.
    const el = document.createElement("div");
    act(() =>
      result.current.onAnimationEnd({
        target: el,
        currentTarget: el,
        animationName: "fadeOut",
      } as never),
    );
    expect(document.activeElement).toBe(trigger);
  });

  it("traps Tab forward from last to first focusable", () => {
    const container = document.createElement("div");
    const a = document.createElement("button");
    const b = document.createElement("button");
    container.append(a, b);
    document.body.appendChild(container);

    const { result } = renderHook(() => {
      const hook = useDialog<HTMLDivElement>();
      (hook.dialogRef as { current: HTMLDivElement | null }).current = container;
      return hook;
    });

    act(() => result.current.openDialog());
    b.focus();
    expect(document.activeElement).toBe(b);

    const tab = new KeyboardEvent("keydown", { key: "Tab", cancelable: true });
    const preventSpy = vi.spyOn(tab, "preventDefault");
    document.dispatchEvent(tab);

    expect(preventSpy).toHaveBeenCalled();
    expect(document.activeElement).toBe(a);
  });

  it("traps Shift+Tab backward from first to last focusable", () => {
    const container = document.createElement("div");
    const a = document.createElement("button");
    const b = document.createElement("button");
    container.append(a, b);
    document.body.appendChild(container);

    const { result } = renderHook(() => {
      const hook = useDialog<HTMLDivElement>();
      (hook.dialogRef as { current: HTMLDivElement | null }).current = container;
      return hook;
    });

    act(() => result.current.openDialog());
    a.focus();
    expect(document.activeElement).toBe(a);

    const tab = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      cancelable: true,
    });
    const preventSpy = vi.spyOn(tab, "preventDefault");
    document.dispatchEvent(tab);

    expect(preventSpy).toHaveBeenCalled();
    expect(document.activeElement).toBe(b);
  });

  it("unmounts via onAnimationEnd only when closeAnimationName matches and target is dialog", () => {
    const { result } = renderHook(() =>
      useDialog<HTMLDivElement>({ closeAnimationName: "slideDown" }),
    );
    act(() => result.current.openDialog());
    expect(result.current.mounted).toBe(true);
    act(() => result.current.closeDialog());
    expect(result.current.open).toBe(false);
    expect(result.current.mounted).toBe(true);

    const fakeElement = document.createElement("div");
    act(() =>
      result.current.onAnimationEnd({
        target: fakeElement,
        currentTarget: fakeElement,
        animationName: "fadeOut",
      } as never),
    );
    expect(result.current.mounted).toBe(true);

    const child = document.createElement("span");
    act(() =>
      result.current.onAnimationEnd({
        target: child,
        currentTarget: fakeElement,
        animationName: "slideDown",
      } as never),
    );
    expect(result.current.mounted).toBe(true);

    act(() =>
      result.current.onAnimationEnd({
        target: fakeElement,
        currentTarget: fakeElement,
        animationName: "slideDown",
      } as never),
    );
    expect(result.current.mounted).toBe(false);
  });
});
