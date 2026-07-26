const PARTNERS = [
  { src: "/logo.png", alt: "Brandovert", size: "sm" as const },
  { src: "/text%20logo.png", alt: "Ohm's", size: "sm" as const },
  { src: "/logo%203%20.png", alt: "Pernod Ricard", size: "lg" as const },
  { src: "/logo%202%20.png", alt: "Finvyce", size: "lg" as const },
];

export function TrustedPartners() {
  return (
    <div className="mx-auto mb-20 max-w-5xl px-4 sm:mb-24 sm:px-6 lg:mb-28 lg:px-8">
      <h3 className="mb-10 text-center text-2xl font-bold tracking-tight text-[#0F2A5F] sm:mb-12 sm:text-3xl md:text-[2.15rem]">
        Our Trusted <span className="text-[#C9A227]">Partners</span>
      </h3>

      <div className="flex flex-nowrap items-center justify-between gap-2 sm:justify-center sm:gap-x-16 lg:gap-x-28">
        {PARTNERS.map((partner) => (
          <img
            key={partner.alt}
            src={partner.src}
            alt={partner.alt}
            className={
              partner.size === "lg"
                ? "h-9 w-auto max-w-[22%] shrink object-contain sm:h-14 sm:max-w-[180px]"
                : "h-4 w-auto max-w-[22%] shrink object-contain sm:h-7 sm:max-w-[140px]"
            }
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
