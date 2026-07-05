import { useEffect, useState } from "react";
import {
  MapContainer,
  ImageOverlay,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { criticalityColor } from "../theme/tokens";
import MapControls from "../components/MapControls";
import CriticalityLegend from "../components/CriticalityLegend";

function FitBounds({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (!bounds) return;
    const t = setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 1 });
    }, 100);
    return () => clearTimeout(t);
  }, [map, bounds]);

  return null;
}

export default function MapView({
  nodes,
  edges,
  bounds,
  satelliteUrl,
  imageId,
  layers,
  disabledNodeIds = [],
  onNodeClick,
  topGatekeeperId,
}) {
  const [satelliteOk, setSatelliteOk] = useState(false);

  useEffect(() => {
    if (!layers.satellite || !satelliteUrl) {
      setSatelliteOk(false);
      return;
    }
    const img = new Image();
    img.onload = () => setSatelliteOk(true);
    img.onerror = () => setSatelliteOk(false);
    img.src = satelliteUrl;
  }, [layers.satellite, satelliteUrl]);

  const center = bounds
    ? [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2]
    : [256, 256];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col p-4">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-[#0d1117] shadow-panel ring-1 ring-white/5">
        <MapContainer
          center={center}
          zoom={0}
          crs={L.CRS.Simple}
          className="h-full w-full rounded-xl"
          style={{ height: "100%", minHeight: "380px" }}
          scrollWheelZoom
          maxZoom={3}
          minZoom={-1}
          zoomControl={false}
        >
          <FitBounds bounds={bounds} />
          <MapControls bounds={bounds} />

          {layers.satellite && satelliteOk && (
            <ImageOverlay url={satelliteUrl} bounds={bounds} opacity={0.92} />
          )}

          {layers.roads &&
            edges.map((edge) => {
              const isCut =
                layers.disabled &&
                (disabledNodeIds.includes(edge.source) ||
                  disabledNodeIds.includes(edge.target));

              const color = layers.heatmap
                ? criticalityColor(edge.criticality)
                : edge.healed
                  ? "#ef4444"
                  : "#22c55e";

              return (
                <Polyline
                  key={edge.id}
                  positions={edge.coords}
                  pathOptions={{
                    color: isCut ? "#4b5563" : color,
                    weight: layers.heatmap ? 5 : 4,
                    opacity: isCut ? 0.25 : 0.92,
                    dashArray: isCut ? "8 6" : edge.healed ? "4 4" : undefined,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />
              );
            })}

          {nodes.map((node) => {
            const isDisabled = disabledNodeIds.includes(node.id);
            const isTopGatekeeper = node.id === topGatekeeperId;
            const isGatekeeper = node.betweenness >= 0.4;

            return (
              <CircleMarker
                key={node.id}
                center={[node.y, node.x]}
                radius={isTopGatekeeper ? 9 : isGatekeeper ? 7 : 4}
                pathOptions={{
                  color: isDisabled || isTopGatekeeper ? "#ef4444" : "#3b82f6",
                  fillColor: isDisabled ? "#ef4444" : "#111827",
                  fillOpacity: isDisabled ? 0.9 : 0.85,
                  weight: isTopGatekeeper ? 3 : 2,
                }}
                eventHandlers={{
                  click: () => onNodeClick?.(node.id),
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -10]}
                  className="custom-tooltip"
                  opacity={1}
                >
                  <div className="text-left">
                    <p className="font-semibold text-text-primary">
                      {isTopGatekeeper ? "Gatekeeper " : ""}
                      {node.name}
                    </p>
                    <p className="mt-0.5 text-text-muted">
                      Betweenness:{" "}
                      <span className="font-mono text-accent-warning">
                        {node.betweenness.toFixed(3)}
                      </span>
                    </p>
                    <p className="mt-1 text-[10px] text-text-muted/70">
                      Click to simulate failure
                    </p>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Sample badge */}
        <div className="absolute left-4 top-4 z-[1000] rounded-lg border border-border/80 bg-bg-card/90 px-3 py-1.5 text-xs shadow-panel backdrop-blur-sm">
          <span className="text-text-muted">Tile </span>
          <span className="font-mono font-semibold text-accent-info">{imageId}</span>
          {!satelliteOk && layers.satellite && (
            <span className="ml-2 text-accent-warning">· no satellite</span>
          )}
        </div>

        {layers.heatmap && <CriticalityLegend />}
      </div>
    </div>
  );
}
