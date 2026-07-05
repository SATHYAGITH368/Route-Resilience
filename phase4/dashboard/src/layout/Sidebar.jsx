import {
  BarChart3,
  BookOpen,
  RotateCcw,
  Settings,
  Zap,
} from "lucide-react";
import LayerToggle from "../components/LayerToggle";
import ScenarioButton from "../components/ScenarioButton";

export default function Sidebar({
  layers,
  onLayerChange,
  scenarios,
  activeScenario,
  onScenarioSelect,
  onDisableTopBottleneck,
  onReset,
  topNodeName,
  isSimulated,
}) {
  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-border bg-bg-card/80 backdrop-blur-sm">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 panel-scroll">
        <section>
          <h2 className="panel-section-title">Layers</h2>
          <div className="space-y-0.5 rounded-xl border border-border/60 bg-bg-primary/30 p-1">
            <LayerToggle
              label="Satellite"
              enabled={layers.satellite}
              onChange={(v) => onLayerChange("satellite", v)}
            />
            <LayerToggle
              label="Road Network"
              enabled={layers.roads}
              onChange={(v) => onLayerChange("roads", v)}
            />
            <LayerToggle
              label="Criticality Heatmap"
              enabled={layers.heatmap}
              onChange={(v) => onLayerChange("heatmap", v)}
            />
            <LayerToggle
              label="Disabled Nodes"
              enabled={layers.disabled}
              onChange={(v) => onLayerChange("disabled", v)}
            />
          </div>
        </section>

        <section>
          <h2 className="panel-section-title">Scenarios</h2>
          <div className="space-y-2">
            {scenarios.map((scenario, i) => (
              <ScenarioButton
                key={scenario.id}
                index={i}
                label={scenario.label}
                active={activeScenario === scenario.id}
                onClick={() => onScenarioSelect(scenario.id, scenario.nodeId)}
              />
            ))}
          </div>
        </section>

        <section className="mt-auto space-y-2">
          <button
            type="button"
            onClick={onDisableTopBottleneck}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-danger to-red-600 px-4 py-3.5 text-sm font-bold text-white shadow-glow-danger transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Zap size={16} fill="currentColor" />
            Disable Top Bottleneck
          </button>
          {topNodeName && (
            <p className="text-center text-[11px] text-text-muted">
              Target gatekeeper:{" "}
              <span className="font-mono text-accent-danger">{topNodeName}</span>
            </p>
          )}
          {isSimulated && (
            <button
              type="button"
              onClick={onReset}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-bg-primary/50 px-4 py-2.5 text-sm text-text-muted transition-colors hover:border-accent-info/40 hover:text-text-primary"
            >
              <RotateCcw size={14} />
              Reset simulation
            </button>
          )}
        </section>
      </div>

      {/* Footer utility icons (mockup) */}
      <div className="flex items-center justify-center gap-1 border-t border-border px-4 py-3">
        {[BarChart3, BookOpen, Settings].map((Icon, i) => (
          <button
            key={i}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-hover hover:text-text-primary"
            title={["Analytics", "Documentation", "Settings"][i]}
          >
            <Icon size={17} />
          </button>
        ))}
      </div>
    </aside>
  );
}
