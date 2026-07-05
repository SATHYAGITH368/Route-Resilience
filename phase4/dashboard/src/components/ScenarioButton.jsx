import { Construction, Droplets, CarFront } from "lucide-react";

const SCENARIO_ICONS = [Droplets, CarFront, Construction];

export default function ScenarioButton({ label, active, onClick, index = 0 }) {
  const Icon = SCENARIO_ICONS[index] ?? Construction;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition-all ${
        active
          ? "border-accent-danger bg-accent-danger/10 text-text-primary shadow-glow-danger"
          : "border-border bg-bg-primary/40 text-text-muted hover:border-accent-danger/40 hover:bg-bg-hover/60 hover:text-text-primary"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-accent-danger/20 text-accent-danger" : "bg-bg-elevated text-text-muted"
        }`}
      >
        <Icon size={16} />
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
