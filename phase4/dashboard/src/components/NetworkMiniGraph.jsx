import { criticalityColor } from "../theme/tokens";

/**
 * SVG mini network graph for before/after comparison bar (mockup bottom panel).
 */
export default function NetworkMiniGraph({
  nodes,
  edges,
  disabledNodeIds = [],
  variant = "safe",
  width = 320,
  height = 120,
}) {
  if (!nodes?.length) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-bg-primary/50 text-xs text-text-muted"
        style={{ width, height }}
      >
        No graph data
      </div>
    );
  }

  const padding = 14;
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scaleX = (width - padding * 2) / (maxX - minX || 1);
  const scaleY = (height - padding * 2) / (maxY - minY || 1);
  const scale = Math.min(scaleX, scaleY);

  const positioned = nodes.map((n) => ({
    ...n,
    sx: padding + (n.x - minX) * scale,
    sy: padding + (n.y - minY) * scale,
  }));

  const nodePos = Object.fromEntries(positioned.map((n) => [n.id, n]));
  const isAfter = variant === "danger";
  const edgeColor = isAfter ? "#ef4444" : "#22c55e";
  const nodeFill = isAfter ? "#1a2332" : "#111827";
  const disabledSet = new Set(disabledNodeIds);

  const visibleEdges = edges.filter(
    (e) =>
      !isAfter ||
      (!disabledSet.has(e.source) && !disabledSet.has(e.target))
  );

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="rounded-lg bg-bg-primary/60"
      preserveAspectRatio="xMidYMid meet"
    >
      {visibleEdges.map((edge) => {
        const a = nodePos[edge.source];
        const b = nodePos[edge.target];
        if (!a || !b) return null;
        return (
          <line
            key={edge.id}
            x1={a.sx}
            y1={a.sy}
            x2={b.sx}
            y2={b.sy}
            stroke={edgeColor}
            strokeWidth={1.5}
            strokeOpacity={isAfter ? 0.7 : 0.85}
          />
        );
      })}

      {positioned.map((node) => {
        const isDisabled = disabledSet.has(node.id);
        const isTop = node.betweenness >= 0.4;

        if (isAfter && isDisabled) {
          return (
            <g key={node.id}>
              <circle cx={node.sx} cy={node.sy} r={7} fill="#ef4444" opacity={0.2} />
              <line
                x1={node.sx - 5}
                y1={node.sy - 5}
                x2={node.sx + 5}
                y2={node.sy + 5}
                stroke="#ef4444"
                strokeWidth={2}
              />
              <line
                x1={node.sx + 5}
                y1={node.sy - 5}
                x2={node.sx - 5}
                y2={node.sy + 5}
                stroke="#ef4444"
                strokeWidth={2}
              />
            </g>
          );
        }

        return (
          <circle
            key={node.id}
            cx={node.sx}
            cy={node.sy}
            r={isTop ? 4 : 3}
            fill={nodeFill}
            stroke={isTop && isAfter ? "#ef4444" : edgeColor}
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}

export function betweennessBarColor(score) {
  return criticalityColor(score);
}
