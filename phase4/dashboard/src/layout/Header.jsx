import { ChevronDown, Shield } from "lucide-react";
import ResilienceGauge from "../components/ResilienceGauge";

export default function Header({
  city,
  cities,
  cityLabels = {},
  onCityChange,
  resilienceIndex,
}) {
  return (
    <header className="relative z-10 flex h-[68px] shrink-0 items-center border-b border-border bg-bg-card/90 px-6 shadow-panel backdrop-blur-md">
      {/* Brand */}
      <div className="flex flex-1 items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-danger/30 to-accent-info/20 shadow-glow">
          <Shield size={22} className="text-accent-info" strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold tracking-tight text-text-primary">
            Route Resilience
          </h1>
          <p className="text-[11px] text-text-muted">Urban Mobility Command Center</p>
        </div>
      </div>

      {/* Center sample selector */}
      <div className="flex flex-1 justify-center">
        <div className="relative">
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="appearance-none rounded-xl border border-border bg-bg-primary py-2 pl-4 pr-10 text-sm font-medium text-text-primary shadow-inner outline-none transition-colors hover:border-accent-info/40 focus:border-accent-info focus:ring-2 focus:ring-accent-info/20"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {cityLabels[c] || c}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
        </div>
      </div>

      {/* Resilience gauge */}
      <div className="flex flex-1 justify-end">
        <ResilienceGauge value={resilienceIndex} />
      </div>
    </header>
  );
}
