import type { ReactNode } from "react";

type CorporateFormLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidthClass?: string;
  largeTitle?: boolean;
};

export function CorporateFormLayout({
  title,
  subtitle,
  children,
  maxWidthClass = "max-w-xl",
  largeTitle = false,
}: CorporateFormLayoutProps) {
  return (
    <div className="min-h-[calc(100dvh-8rem)] bg-[#eef3f9] pt-20 sm:pt-24">
      <div className={`${maxWidthClass} mx-auto px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8`}>
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,42,95,0.12)] sm:p-8 lg:p-10">
          <h1
            className={
              largeTitle
                ? "text-center text-2xl font-bold leading-tight tracking-tight text-[#0F2A5F] sm:text-3xl lg:text-4xl"
                : "text-center text-[15px] font-bold leading-snug text-[#0F2A5F] sm:text-base"
            }
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-center text-xs leading-relaxed text-slate-500 sm:text-sm">{subtitle}</p>
          ) : null}
          <div className="mt-5 sm:mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
