import type { ReactNode } from "react";

type OutlinedFieldProps = {
  label: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

export function OutlinedField({
  label,
  required,
  optional,
  className = "",
  children,
}: OutlinedFieldProps) {
  const labelText = optional ? `${label} (optional)` : required ? `${label} *` : label;

  return (
    <div
      className={`group relative border border-slate-300 bg-white transition-colors hover:border-slate-400 focus-within:border-[#0F2A5F] focus-within:ring-1 focus-within:ring-[#0F2A5F]/25 ${className}`}
    >
      <span className="absolute -top-2.5 left-3 z-10 bg-white px-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#0F2A5F] leading-none">
        {labelText}
      </span>
      <div className="px-4 py-3.5">{children}</div>
    </div>
  );
}

export const outlinedInputClass =
  "w-full border-0 bg-transparent p-0 outline-none text-slate-800 text-[15px] placeholder:text-slate-400";
