/**
 * theme/tokens.js — design tokens aligned with dashboard mockup
 */

export const colors = {
  bgPrimary: "#0a0e17",
  bgCard: "#111827",
  bgElevated: "#1a2332",
  bgHover: "#243044",
  border: "#2d3f56",
  borderGlow: "rgba(52, 152, 219, 0.25)",
  textPrimary: "#f0f4f8",
  textMuted: "#8b9cb3",
  danger: "#ef4444",
  warning: "#f59e0b",
  safe: "#22c55e",
  info: "#3b82f6",
  mapFrame: "#0d1117",
};

export function criticalityColor(score) {
  if (score >= 0.7) return colors.danger;
  if (score >= 0.4) return colors.warning;
  return colors.safe;
}

export function resilienceLabel(value) {
  if (value >= 0.85) return { text: "Healthy", color: colors.safe };
  if (value >= 0.65) return { text: "Moderate Risk", color: colors.warning };
  return { text: "Vulnerable", color: colors.danger };
}

export function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}
