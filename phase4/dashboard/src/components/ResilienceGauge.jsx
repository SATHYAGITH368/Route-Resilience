import { resilienceLabel } from "../theme/tokens";

/**
 * Semi-circular resilience gauge (mockup header, top-right).
 */
export default function ResilienceGauge({ value }) {
  const percent = Math.round(value * 100);
  const { text, color } = resilienceLabel(value);

  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference - value * circumference;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-primary/50 px-4 py-2 shadow-panel">
      <div className="relative h-14 w-[72px]">
        <svg className="h-14 w-[72px]" viewBox="0 0 100 56">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#2d3f56"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute inset-x-0 bottom-0 text-center text-sm font-bold tabular-nums text-text-primary">
          {percent}%
        </span>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
          Resilience Index
        </p>
        <p className="text-sm font-semibold" style={{ color }}>
          {text}
        </p>
      </div>
    </div>
  );
}
