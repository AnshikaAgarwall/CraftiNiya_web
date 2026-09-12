import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/cn.js";
import s from "./Overlay.module.css";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keep Tab inside the panel while it is open, and return focus to whatever
 * opened it on close. Without this, tabbing walks invisibly into the page
 * behind the overlay — one of the most common accessibility defects in
 * drawer-based commerce UIs.
 */
function useFocusTrap(open, panelRef) {
  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const panel = panelRef.current;

    const first = panel?.querySelector(FOCUSABLE);
    (first ?? panel)?.focus?.();

    const onKeyDown = (e) => {
      if (e.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      );
      if (!items.length) return;

      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, panelRef]);
}

/** Slide-in panel. Used for the cart and the mobile menu. */
export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  width,
  footer,
  children,
  className,
}) {
  const panelRef = useRef(null);
  useFocusTrap(open, panelRef);

  if (!open) return null;

  return createPortal(
    <div className={s.root}>
      <div className={s.scrim} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={cn(s.drawer, s[`side_${side}`], className)}
        style={width ? { "--drawer-w": width } : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <header className={s.header}>
          <h2 className={s.title}>{title}</h2>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close">
            <X />
          </button>
        </header>
        <div className={s.body}>{children}</div>
        {footer && <footer className={s.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

/** Centred dialog. Used for confirmations and small forms. */
export function Modal({ open, onClose, title, size = "md", footer, children, className }) {
  const panelRef = useRef(null);
  useFocusTrap(open, panelRef);

  if (!open) return null;

  return createPortal(
    <div className={s.root}>
      <div className={s.scrim} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={cn(s.modal, s[`size_${size}`], className)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <header className={s.header}>
          <h2 className={s.title}>{title}</h2>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close">
            <X />
          </button>
        </header>
        <div className={s.body}>{children}</div>
        {footer && <footer className={s.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

export default { Drawer, Modal };
