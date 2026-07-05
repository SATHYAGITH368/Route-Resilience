/**
 * Gradient criticality legend (mockup bottom-left of map).
 */
export default function CriticalityLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-border bg-bg-card/95 p-3 shadow-panel backdrop-blur-sm">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        Criticality (Edge Load)
      </p>
      <div
        className="mb-2 h-2.5 w-36 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 100%)",
        }}
      />
      <div className="flex justify-between text-[10px] text-text-muted">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
}
