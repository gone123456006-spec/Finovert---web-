import type { ReactNode } from "react";

export function FormSection({
  step,
  title,
  hideHeading = false,
  children,
}: {
  step: number;
  title: string;
  hideHeading?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={hideHeading ? "mb-5 last-of-type:mb-6" : "mb-8 last-of-type:mb-6"}>
      {!hideHeading && (
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F2A5F] text-sm font-bold text-white">
            {step}
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F2A5F]">{title}</h2>
        </div>
      )}
      {children}
    </section>
  );
}
