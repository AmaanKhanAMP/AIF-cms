"use client";

import { useId, useState } from "react";
import { cn } from "@/utils/cn";

/**
 * Premium input with floating label.
 * Floating fields use a taller box so the label never overlaps the value.
 */
export default function Input({
  label,
  error,
  hint,
  className,
  id,
  value,
  defaultValue,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  ...props
}) {
  const autoId = useId();
  const inputId = id || props.name || autoId;
  const [focused, setFocused] = useState(false);
  const hasValue =
    (value !== undefined && value !== null && String(value).length > 0) ||
    (value === undefined &&
      defaultValue !== undefined &&
      defaultValue !== null &&
      String(defaultValue).length > 0);
  const floated = focused || hasValue || Boolean(placeholder);

  if (!label) {
    return (
      <div className="block space-y-1.5">
        <input
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          className={cn("cms-input", error && "border-red-300", className)}
          {...props}
        />
        {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
        {!error && hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </div>
    );
  }

  return (
    <div className="block space-y-1.5">
      <div className="relative">
        <input
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          placeholder={floated ? placeholder || " " : " "}
          onChange={onChange}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            "peer cms-input !h-14 px-3.5 pb-2.5 pt-6 text-sm leading-snug",
            error &&
              "border-red-300 focus:!border-red-400 focus:!shadow-[0_0_0_4px_rgba(248,113,113,0.15)]",
            className
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-3.5 text-slate-400 transition-all duration-150",
            floated
              ? "top-2 text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--primary)]"
              : "top-1/2 -translate-y-1/2 text-sm"
          )}
        >
          {label}
        </label>
      </div>
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
    </div>
  );
}
