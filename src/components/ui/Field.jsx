import { forwardRef, useId } from "react";
import { cn } from "../../lib/cn.js";
import s from "./Field.module.css";

/**
 * Form controls.
 *
 * Every control gets a real <label> tied by id, and errors are wired through
 * aria-describedby + aria-invalid so screen readers announce the problem
 * rather than just a red border. Borders use --c-border-strong: an interactive
 * edge needs 3:1 contrast, which the decorative divider colour does not meet.
 */

function FieldShell({ id, label, hint, error, required, children, className }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn(s.field, error && s.hasError, className)}>
      {label && (
        <label className={s.label} htmlFor={id}>
          {label}
          {required && (
            <span className={s.required} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children({ hintId, errorId })}
      {hint && !error && (
        <p className={s.hint} id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className={s.error} id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const Input = forwardRef(function Input(
  { label, hint, error, required, className, id: idProp, startIcon, ...rest },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? reactId;

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      {({ hintId, errorId }) => (
        <div className={cn(s.control, startIcon && s.hasIcon)}>
          {startIcon && (
            <span className={s.icon} aria-hidden="true">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={s.input}
            required={required}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={cn(errorId, hintId) || undefined}
            {...rest}
          />
        </div>
      )}
    </FieldShell>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, hint, error, required, className, id: idProp, rows = 4, ...rest },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? reactId;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      {({ hintId, errorId }) => (
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={cn(s.input, s.textarea)}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={cn(errorId, hintId) || undefined}
          {...rest}
        />
      )}
    </FieldShell>
  );
});

export const Select = forwardRef(function Select(
  { label, hint, error, required, className, id: idProp, options = [], children, ...rest },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? reactId;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      {({ hintId, errorId }) => (
        <div className={cn(s.control, s.selectWrap)}>
          <select
            ref={ref}
            id={id}
            className={cn(s.input, s.select)}
            required={required}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={cn(errorId, hintId) || undefined}
            {...rest}
          >
            {children ??
              options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
          </select>
          <span className={s.chevron} aria-hidden="true" />
        </div>
      )}
    </FieldShell>
  );
});

export function Checkbox({ label, className, id: idProp, ...rest }) {
  const reactId = useId();
  const id = idProp ?? reactId;
  return (
    <div className={cn(s.choice, className)}>
      <input id={id} type="checkbox" className={s.choiceInput} {...rest} />
      <label htmlFor={id} className={s.choiceLabel}>
        {label}
      </label>
    </div>
  );
}

export function Radio({ label, className, id: idProp, ...rest }) {
  const reactId = useId();
  const id = idProp ?? reactId;
  return (
    <div className={cn(s.choice, className)}>
      <input id={id} type="radio" className={s.choiceInput} {...rest} />
      <label htmlFor={id} className={s.choiceLabel}>
        {label}
      </label>
    </div>
  );
}

export default { Input, Textarea, Select, Checkbox, Radio };
