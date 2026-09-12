import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn.js";
import { Spinner } from "./Feedback.jsx";
import s from "./Button.module.css";

/**
 * One button, every variant.
 *
 * Renders as <button>, <a>, or react-router <Link> depending on props, so a
 * link that looks like a button is still a link — right-click, middle-click
 * and "open in new tab" all keep working.
 */
const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    to,
    href,
    type = "button",
    loading = false,
    disabled = false,
    fullWidth = false,
    iconOnly = false,
    startIcon = null,
    endIcon = null,
    className,
    children,
    ...rest
  },
  ref,
) {
  const classes = cn(
    s.button,
    s[variant],
    s[size],
    fullWidth && s.fullWidth,
    iconOnly && s.iconOnly,
    loading && s.loading,
    className,
  );

  const content = (
    <>
      {loading && <Spinner size={size === "sm" ? 14 : 16} className={s.spinner} />}
      {!loading && startIcon}
      {children && <span className={s.label}>{children}</span>}
      {!loading && endIcon}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} aria-disabled={disabled || undefined} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
});

export default Button;
