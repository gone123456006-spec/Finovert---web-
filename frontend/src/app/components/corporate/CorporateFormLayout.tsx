import type { ReactNode } from "react";

type CorporateFormLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidthClass?: string;
};

export function CorporateFormLayout({
  title,
  subtitle = "Complete all sections below",
  children,
  maxWidthClass = "max-w-3xl",
}: CorporateFormLayoutProps) {
  return (
    <div className="bg-slate-50 min-h-[calc(100dvh-8rem)] pt-20 sm:pt-24">
      <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12`}>
        <div className="bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F2A5F]">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
