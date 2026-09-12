import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "../../lib/cn.js";
import { useUI } from "../../context/UIContext.jsx";
import s from "./Toaster.module.css";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export default function Toaster() {
  const { toasts, dismissToast } = useUI();

  if (!toasts.length) return null;

  return createPortal(
    /* aria-live so confirmations are announced; polite because an "added to
       bag" message must not interrupt whatever is being read. */
    <div className={s.stack} role="status" aria-live="polite">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] ?? Info;
        return (
          <div key={t.id} className={cn(s.toast, s[t.type])}>
            <Icon className={s.icon} aria-hidden="true" />
            <p className={s.message}>{t.message}</p>

            {t.action && (
              <button
                type="button"
                className={s.action}
                onClick={() => {
                  t.action.onClick?.();
                  dismissToast(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}

            <button
              type="button"
              className={s.close}
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss"
            >
              <X />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
