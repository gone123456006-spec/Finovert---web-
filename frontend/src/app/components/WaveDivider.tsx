/** Smooth wave between two section background colors */
export function WaveDivider({
  topColor = "#ffffff",
  fill = "#f4f6f9",
  className = "",
}: {
  topColor?: string;
  fill?: string;
  className?: string;
}) {
  return (
    <div className="leading-[0]" style={{ backgroundColor: topColor }} aria-hidden="true">
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className={`block w-full h-10 sm:h-20 md:h-28 lg:h-32 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill={fill}
          d="M0,62
             C240,18 480,88 720,28
             C960,72 1200,14 1440,52
             L1440,96 L0,96 Z"
        />
      </svg>
    </div>
  );
}
