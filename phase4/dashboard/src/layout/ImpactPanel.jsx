import { Activity, GitBranch, Route } from "lucide-react";
import MetricCard from "../components/MetricCard";
import GatekeeperRow from "../components/GatekeeperRow";

export default function ImpactPanel({
  metrics,
  gatekeepers,
  disabledNodeIds,
  onSimulateNode,
}) {
  const isSimulated = disabledNodeIds.length > 0;

  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-l border-border bg-bg-card/80 backdrop-blur-sm">
      <div className="flex flex-1 flex-col gap-5 overflow-hidden p-4">
        <section>
          <h2 className="panel-section-title">Impact Metrics</h2>
          <div className="space-y-2">
            <MetricCard
              icon={Route}
              label="Avg Path Length"
              before={Number(metrics.avgPathLength).toFixed(2)}
              after={
                isSimulated &&
                metrics.perturbedAvgPathLength != null &&
                metrics.perturbedAvgPathLength !== metrics.avgPathLength
                  ? Number(metrics.perturbedAvgPathLength).toFixed(2)
                  : undefined
              }
            />
            <MetricCard
              icon={GitBranch}
              label="Connected Components"
              before={
                metrics.baselineConnectedComponents === 1
                  ? "1 (unified)"
                  : metrics.baselineConnectedComponents ?? "—"
              }
              after={
                isSimulated ? `${metrics.connectedComponents} (split)` : undefined
              }
            />
            <MetricCard
              icon={Activity}
              label="Resilience Index"
              before={isSimulated ? "1.00" : metrics.resilienceIndex.toFixed(2)}
              after={isSimulated ? metrics.resilienceIndex.toFixed(2) : undefined}
            />
          </div>
        </section>

        <section className="flex min-h-0 flex-1 flex-col">
          <h2 className="panel-section-title">Top Gatekeeper Nodes</h2>
          <div className="mb-2 grid grid-cols-[28px_1fr_52px] gap-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-text-muted/70">
            <span>#</span>
            <span>Node</span>
            <span className="text-right">BC</span>
          </div>
          <div className="panel-scroll space-y-2 overflow-y-auto pr-1">
            {gatekeepers.map((node) => (
              <GatekeeperRow
                key={node.id}
                rank={node.rank}
                node={node}
                isDisabled={disabledNodeIds.includes(node.id)}
                onSimulate={onSimulateNode}
              />
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
