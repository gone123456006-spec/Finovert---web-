import { motion, useReducedMotion } from "motion/react";
import stepFillForm from "@/assets/how-it-works/step-fill-form.png";
import stepSubmitDocs from "@/assets/how-it-works/step-submit-docs.png";
import stepPayFees from "@/assets/how-it-works/step-pay-fees.png";
import stepRegistered from "@/assets/how-it-works/step-registered.png";

const STEPS = [
  {
    step: "01",
    label: "Fill up the forms",
    image: stepFillForm,
  },
  {
    step: "02",
    label: "Submit the Documents",
    image: stepSubmitDocs,
  },
  {
    step: "03",
    label: "Pay Fees",
    image: stepPayFees,
  },
  {
    step: "04",
    label: "Get your Company Registered",
    image: stepRegistered,
  },
] as const;

function StepArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 28" className={className} fill="currentColor" aria-hidden="true">
      <path d="M0 9.5h46v9H0z" />
      <path d="M44 0 L72 14 L44 28 Z" />
    </svg>
  );
}

function FlyingArrow({ size = "md" }: { size?: "sm" | "md" }) {
  const reduceMotion = useReducedMotion();
  const arrowClass =
    size === "sm"
      ? "w-9 h-4 text-[#E07A2F] drop-shadow-sm"
      : "w-24 h-10 lg:w-28 lg:h-12 text-[#E07A2F] drop-shadow-sm";

  if (reduceMotion) {
    return <StepArrow className={arrowClass} />;
  }

  return (
    <span
      className={`relative inline-flex items-center justify-center overflow-visible ${
        size === "sm" ? "h-6 w-11" : "h-12 w-32"
      }`}
      aria-hidden="true"
    >
      {[0, 0.28, 0.56].map((delay, i) => (
        <motion.span
          key={delay}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 1 - i * 0.3 }}
          initial={{ x: -12, opacity: 0 }}
          animate={{ x: size === "sm" ? [-8, 10] : [-16, 20], opacity: [0, 1, 0] }}
          transition={{
            duration: 1.25,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
            repeatDelay: 0.05,
          }}
        >
          <StepArrow className={arrowClass} />
        </motion.span>
      ))}
    </span>
  );
}

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#F4F8FC] py-14 sm:py-20">
      <div
        className="pointer-events-none absolute -left-24 -bottom-28 h-72 w-72 rounded-full bg-[#BFD7F0]/55 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -bottom-32 h-80 w-80 rounded-full bg-[#BFD7F0]/50 blur-2xl"
        aria-hidden="true"
      />
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-[42%] max-w-md text-[#C5DBF0]/70"
        viewBox="0 0 400 120"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0 120 C60 40 140 90 200 55 C260 20 320 70 400 30 L400 120 Z" />
      </svg>
      <svg
        className="pointer-events-none absolute bottom-0 right-0 w-[42%] max-w-md text-[#C5DBF0]/70"
        viewBox="0 0 400 120"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0 30 C80 70 140 20 200 55 C260 90 340 40 400 120 L0 120 Z" />
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[1.45rem] sm:text-[1.85rem] lg:text-[2.1rem] font-bold tracking-tight leading-tight mb-10 sm:mb-14">
          <span className="text-[#0F2A5F]">Private Limited Company Registration In</span>
          <br />
          <span className="text-[#3B6EA5]">4 Easy Steps</span>
        </h2>

        {/* Desktop / tablet */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-4 gap-4 lg:gap-6 mb-5">
            {STEPS.map((item, index) => (
              <div key={item.step} className="relative flex justify-center">
                <motion.div
                  className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-[#0F2A5F] text-white text-sm lg:text-base font-bold shadow-md"
                  whileInView={{ scale: [0.92, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  {item.step}
                </motion.div>
                {index < STEPS.length - 1 && (
                  <div className="absolute top-1/2 -right-3 lg:-right-4 -translate-y-1/2 translate-x-1/2">
                    <FlyingArrow />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4 lg:gap-6">
            {STEPS.map((item, index) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="w-full aspect-square max-w-[200px] rounded-2xl bg-white shadow-[0_10px_28px_rgba(15,42,95,0.12)] border border-slate-100 overflow-hidden mb-4">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-full w-full object-contain object-center p-2 bg-white"
                    loading="eager"
                  />
                </div>
                <p className="text-[13px] lg:text-sm font-medium text-[#0F2A5F] leading-snug px-1 text-center text-balance">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile — two cards centered across the screen */}
        <div className="sm:hidden w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          <div className="flex items-start gap-3 px-3 pb-2 min-w-max">
            {STEPS.map((item, index) => (
              <div
                key={item.step}
                className="flex items-start snap-center"
                style={{ width: "calc((100vw - 2.25rem) / 2)" }}
              >
                <div className="flex w-full flex-col items-center text-center px-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F2A5F] text-white text-sm font-bold mb-2.5 shadow-md">
                    {item.step}
                  </div>
                  <div className="relative w-full">
                    <div className="w-full aspect-square rounded-2xl bg-white shadow-[0_8px_22px_rgba(15,42,95,0.12)] border border-slate-100 overflow-hidden mb-2.5">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="h-full w-full object-contain object-center p-1.5 bg-white"
                        loading="eager"
                      />
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="pointer-events-none absolute top-[-2.35rem] -right-5 z-10 flex h-10 w-8 items-center justify-center">
                        <FlyingArrow size="sm" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-[#0F2A5F] leading-snug text-center text-balance px-0.5">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
