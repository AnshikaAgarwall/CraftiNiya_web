import { AlertCircle, Loader2, PackageOpen, RefreshCw } from "lucide-react";
import { cn } from "../../lib/cn.js";
import Button from "./Button.jsx";
import s from "./Feedback.module.css";

/** Loading, empty and error presentations — the three states every list needs. */

export function Spinner({ size = 18, className }) {
  return (
    <Loader2
      className={cn(s.spinner, className)}
      width={size}
      height={size}
      aria-hidden="true"
    />
  );
}

export function Skeleton({ width, height, radius, className, style }) {
  return (
    <span
      className={cn(s.skeleton, className)}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

/** Card-shaped placeholder matching ProductCard's proportions. */
export function ProductCardSkeleton() {
  return (
    <div className={s.cardSkeleton}>
      <Skeleton className={s.cardSkeletonImage} />
      <Skeleton height={11} width="40%" />
      <Skeleton height={16} width="85%" />
      <Skeleton height={14} width="55%" />
    </div>
  );
}

export function LoadingBlock({ label = "Loading…", className }) {
  return (
    <div className={cn(s.block, className)} role="status" aria-live="polite">
      <Spinner size={22} />
      <p className={s.blockText}>{label}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title = "Nothing here yet",
  message,
  action,
  className,
}) {
  return (
    <div className={cn(s.state, className)}>
      <span className={s.stateIcon} aria-hidden="true">
        <Icon />
      </span>
      <h3 className={s.stateTitle}>{title}</h3>
      {message && <p className={s.stateText}>{message}</p>}
      {action && <div className={s.stateAction}>{action}</div>}
    </div>
  );
}

/**
 * Error presentation driven by the ApiError shape. Retry only appears when the
 * error is actually retryable — offering it on a 404 just wastes a click.
 */
export function ErrorState({ error, onRetry, className, title = "That did not load" }) {
  const message = error?.message ?? "Something went wrong. Please try again.";
  const canRetry = Boolean(onRetry) && (error?.retryable ?? true);

  return (
    <div className={cn(s.state, s.stateError, className)} role="alert">
      <span className={cn(s.stateIcon, s.stateIconError)} aria-hidden="true">
        <AlertCircle />
      </span>
      <h3 className={s.stateTitle}>{title}</h3>
      <p className={s.stateText}>{message}</p>
      {canRetry && (
        <div className={s.stateAction}>
          <Button variant="secondary" size="sm" onClick={onRetry} startIcon={<RefreshCw size={15} />}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}

export default { Spinner, Skeleton, ProductCardSkeleton, LoadingBlock, EmptyState, ErrorState };
