export default function LayerToggle({ label, enabled, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-bg-hover/60">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-200 ${
          enabled
            ? "bg-accent-info shadow-[0_0_12px_rgba(59,130,246,0.35)]"
            : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
