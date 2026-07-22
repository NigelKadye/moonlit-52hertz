import { Link } from "react-router-dom";

type BrandLockupProps = {
  to?: string;
  className?: string;
  showTagline?: boolean;
};

export default function BrandLockup({
  to = "/",
  className = "",
  showTagline = true,
}: BrandLockupProps) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-start gap-2.5 ${className}`.trim()}
      aria-label="52Hertz home"
    >
      <span className="flex items-end leading-none text-lime">
        <span className="text-[2.65rem] font-extrabold transition-transform group-hover:scale-105">
          5
        </span>
        <span className="mb-[0.2rem] text-[1.85rem] font-bold">2</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-[-0.04em] text-white">
          hertz
        </span>
        {showTagline && (
          <span className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/70">
            Continuous improvement specialists
          </span>
        )}
      </span>
    </Link>
  );
}
