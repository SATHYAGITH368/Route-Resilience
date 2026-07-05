import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

export default function MetricCard({ label, before, after, suffix = "", icon: Icon }) {
  const hasDelta = after !== undefined && after !== before;
  const delta =
    hasDelta && typeof before === "number" && typeof after === "number" && before !== 0
      ? (((after - before) / before) * 100).toFixed(0)
      : null;
  const isIncrease = delta && Number(delta) > 0;

  return (
    <div className="rounded-xl border border-border bg-bg-primary/80 p-3.5 transition-colors hover:border-border-glow">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
          {label}
        </p>
        {Icon && <Icon size={14} className="text-text-muted/60" />}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {hasDelta ? (
          <>
            <span className="text-xl font-semibold tabular-nums text-text-muted/70 line-through decoration-text-muted/40">
              {before}
              {suffix}
            </span>
            <ArrowRight size={14} className="shrink-0 text-text-muted" />
            <span className="text-xl font-bold tabular-nums text-accent-danger">
              {after}
              {suffix}
            </span>
            {delta && (
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  isIncrease
                    ? "bg-accent-danger/15 text-accent-danger"
                    : "bg-accent-safe/15 text-accent-safe"
                }`}
              >
                {isIncrease ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {isIncrease ? "+" : ""}
                {delta}%
              </span>
            )}
          </>
        ) : (
          <span className="text-xl font-bold tabular-nums text-text-primary">
            {before}
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
