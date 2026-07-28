"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function FormShell({
  title,
  description,
  children,
  onSubmit,
  onCancel,
  loading,
  submitLabel = "Save",
  submitDisabled = false,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (loading || submitDisabled) return;
        onSubmit?.();
      }}
      className="mx-auto max-w-4xl space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8"
      >
        <div className="mb-8 border-b border-[#E2E8F0] pb-5">
          <h2 className="font-display text-xl font-bold text-[#111827]">{title}</h2>
          {description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">{description}</p>
          ) : null}
        </div>
        <div className="space-y-6">{children}</div>
      </motion.div>
      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-2 rounded-2xl border border-[#E2E8F0] bg-white/90 p-3 shadow-[var(--shadow-md)] backdrop-blur-xl">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" loading={loading} disabled={submitDisabled}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
