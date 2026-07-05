import NetworkMiniGraph from "../components/NetworkMiniGraph";

export default function BottomComparison({
  isSimulated,
  metrics,
  disabledNodeId,
  topGatekeeperId,
  nodes,
  edges,
  disabledNodeIds,
}) {
  const targetId = disabledNodeId ?? topGatekeeperId;
  const targetName = nodes?.find((n) => n.id === targetId)?.name ?? targetId;

  const before = {
    path: metrics.baselineAvgPathLength ?? metrics.avgPathLength,
    components: metrics.baselineConnectedComponents ?? metrics.connectedComponents,
    resilience: 1.0,
  };

  const after = isSimulated
    ? {
        path: metrics.perturbedAvgPathLength ?? "—",
        components: metrics.connectedComponents,
        resilience: metrics.resilienceIndex,
      }
    : null;

  return (
    <footer className="shrink-0 border-t border-border bg-bg-card/90 px-5 py-4 backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-5">
        <ComparisonCard
          title="Before: Healthy Network"
          variant="safe"
          path={before.path}
          components={before.components}
          resilience={before.resilience}
          nodes={nodes}
          edges={edges}
          disabledNodeIds={[]}
          dimmed={false}
        />
        <ComparisonCard
          title={
            isSimulated
              ? `After: Node Removed (${targetName})`
              : "After: Node Removed"
          }
          variant={isSimulated ? "danger" : "muted"}
          path={after?.path ?? "—"}
          components={after?.components ?? "—"}
          resilience={after?.resilience ?? "—"}
          nodes={nodes}
          edges={edges}
          disabledNodeIds={disabledNodeIds}
          dimmed={!isSimulated}
          placeholder={
            !isSimulated
              ? "Click Simulate or Disable Top Bottleneck to preview network fracture"
              : null
          }
        />
      </div>
    </footer>
  );
}

function ComparisonCard({
  title,
  variant,
  path,
  components,
  resilience,
  nodes,
  edges,
  disabledNodeIds,
  dimmed,
  placeholder,
}) {
  const borderClass =
    variant === "safe"
      ? "border-accent-safe/40 shadow-[inset_0_0_30px_rgba(34,197,94,0.06)]"
      : variant === "danger"
        ? "border-accent-danger/50 shadow-[inset_0_0_30px_rgba(239,68,68,0.08)]"
        : "border-border";

  const titleColor =
    variant === "safe"
      ? "text-accent-safe"
      : variant === "danger"
        ? "text-accent-danger"
        : "text-text-muted";

  return (
    <div
      className={`rounded-xl border bg-bg-primary/60 p-4 transition-opacity ${borderClass} ${
        dimmed ? "opacity-45" : ""
      }`}
    >
      <p className={`mb-3 text-xs font-bold uppercase tracking-wide ${titleColor}`}>
        {title}
      </p>

      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div className="min-w-0">
          {placeholder ? (
            <div className="flex h-[120px] items-center justify-center rounded-lg border border-dashed border-border bg-bg-card/30 px-4 text-center text-xs text-text-muted">
              {placeholder}
            </div>
          ) : (
            <NetworkMiniGraph
              nodes={nodes}
              edges={edges}
              disabledNodeIds={disabledNodeIds}
              variant={variant === "danger" ? "danger" : "safe"}
              height={120}
            />
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 text-right">
          <Stat label="Components" value={components} variant={variant} />
          <Stat
            label="Path Length"
            value={typeof path === "number" ? path.toFixed(2) : path}
            variant={variant}
          />
          <Stat
            label="Resilience"
            value={
              typeof resilience === "number" ? resilience.toFixed(2) : resilience
            }
            variant={variant}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, variant }) {
  const valueColor =
    variant === "safe"
      ? "text-accent-safe"
      : variant === "danger"
        ? "text-accent-danger"
        : "text-text-primary";

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-text-muted">{label}</p>
      <p className={`font-mono text-sm font-bold tabular-nums ${valueColor}`}>{value}</p>
    </div>
  );
}
