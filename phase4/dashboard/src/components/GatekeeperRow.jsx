import { criticalityColor } from "../theme/tokens";

export default function GatekeeperRow({ rank, node, isDisabled, onSimulate }) {
  const barColor = criticalityColor(node.betweenness);

  return (
    <div
      className={`group rounded-xl border p-3 transition-all ${
        isDisabled
          ? "border-accent-danger/60 bg-accent-danger/10 shadow-glow-danger"
          : "border-border bg-bg-primary/60 hover:border-accent-info/30 hover:bg-bg-hover/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
            rank === 1
              ? "bg-accent-danger/20 text-accent-danger"
              : "bg-bg-elevated text-text-muted"
          }`}
        >
          {rank}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text-primary">{node.name}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(node.betweenness * 100, 100)}%`,
                  backgroundColor: barColor,
                }}
              />
            </div>
            <span className="shrink-0 font-mono text-[11px] text-text-muted">
              {node.betweenness.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSimulate(node.id)}
          disabled={isDisabled}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            isDisabled
              ? "cursor-not-allowed bg-accent-danger/20 text-accent-danger"
              : "border border-border bg-bg-elevated text-text-primary hover:border-accent-info hover:bg-accent-info/10"
          }`}
        >
          {isDisabled ? "Active" : "Simulate"}
        </button>
      </div>
    </div>
  );
}
