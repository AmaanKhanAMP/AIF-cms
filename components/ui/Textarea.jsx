"use client";

import { cn } from "@/utils/cn";

export default function Textarea({
  label,
  error,
  hint,
  className,
  rows = 4,
  maxLength,
  value,
  ...props
}) {
  const length = String(value ?? "").length;
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        {label ? <span className="text-[13px] font-semibold text-slate-700">{label}</span> : <span />}
        {maxLength ? (
          <span className="text-[11px] tabular-nums text-slate-400">
            {length}/{maxLength}
          </span>
        ) : null}
      </div>
      <textarea
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={cn(
          "w-full resize-y rounded-[0.875rem] border border-[var(--border)] bg-white px-3.5 py-3.5 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--primary-light)] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.14)]",
          error && "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.15)]",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}
