import { LocateFixed, Minus, Plus } from "lucide-react";
import { useMap } from "react-leaflet";

export default function MapControls({ bounds }) {
  const map = useMap();

  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-1.5">
      <ControlBtn icon={Plus} label="Zoom in" onClick={() => map.zoomIn()} />
      <ControlBtn icon={Minus} label="Zoom out" onClick={() => map.zoomOut()} />
      <ControlBtn
        icon={LocateFixed}
        label="Reset view"
        onClick={() => bounds && map.fitBounds(bounds, { padding: [30, 30], maxZoom: 1 })}
      />
    </div>
  );
}

function ControlBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-card/95 text-text-muted shadow-panel backdrop-blur-sm transition-colors hover:border-accent-info/50 hover:text-text-primary"
    >
      <Icon size={16} />
    </button>
  );
}
