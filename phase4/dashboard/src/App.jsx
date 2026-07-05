import { useEffect, useState } from "react";
import { Loader2, Shield } from "lucide-react";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import ImpactPanel from "./layout/ImpactPanel";
import BottomComparison from "./layout/BottomComparison";
import MapView from "./map/MapView";
import {
  SAMPLES,
  fetchAnalysis,
  loadAnalysisFromFile,
  metricsForNode,
} from "./data/loadAnalysis";

export default function App() {
  const [sampleId, setSampleId] = useState(SAMPLES[0].id);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeScenario, setActiveScenario] = useState(null);
  const [disabledNodeIds, setDisabledNodeIds] = useState([]);

  const [layers, setLayers] = useState({
    satellite: false,
    roads: true,
    heatmap: true,
    disabled: true,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setDisabledNodeIds([]);
    setActiveScenario(null);

    fetchAnalysis(sampleId)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sampleId]);

  const isSimulated = disabledNodeIds.length > 0;

  const metrics = (() => {
    if (!data) {
      return {
        avgPathLength: 0,
        perturbedAvgPathLength: 0,
        resilienceIndex: 1,
        connectedComponents: 1,
      };
    }
    if (!isSimulated) {
      return {
        ...data.baselineMetrics,
        baselineAvgPathLength: data.baselineMetrics.avgPathLength,
        baselineConnectedComponents: data.baselineMetrics.connectedComponents,
      };
    }
    const lastDisabled = disabledNodeIds[disabledNodeIds.length - 1];
    const m = metricsForNode(data, lastDisabled);
    return {
      ...m,
      baselineAvgPathLength: data.baselineMetrics.avgPathLength,
      baselineConnectedComponents: data.baselineMetrics.connectedComponents,
    };
  })();

  function handleLayerChange(key, value) {
    setLayers((prev) => ({ ...prev, [key]: value }));
  }

  function handleSimulateNode(nodeId) {
    setDisabledNodeIds((prev) =>
      prev.includes(nodeId) ? prev : [...prev, nodeId]
    );
    setActiveScenario(null);
  }

  function handleScenarioSelect(scenarioId, nodeId) {
    setActiveScenario(scenarioId);
    setDisabledNodeIds([nodeId]);
  }

  function handleDisableTopBottleneck() {
    if (data?.topGatekeeper) {
      setDisabledNodeIds([data.topGatekeeper.id]);
      setActiveScenario(null);
    }
  }

  function handleReset() {
    setDisabledNodeIds([]);
    setActiveScenario(null);
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const d = await loadAnalysisFromFile(file);
      setData(d);
      setSampleId(d.imageId);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="app-shell flex h-screen flex-col items-center justify-center gap-4 text-text-muted">
        <Loader2 size={32} className="animate-spin text-accent-info" />
        <p className="text-sm font-medium">Loading Phase III analysis…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app-shell flex h-screen flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-danger/15">
          <Shield size={28} className="text-accent-danger" />
        </div>
        <p className="text-lg font-semibold text-text-primary">Analysis data not loaded</p>
        <p className="max-w-lg whitespace-pre-line text-sm text-text-muted">{error}</p>

        <div className="panel max-w-md rounded-2xl p-6 text-left">
          <p className="mb-3 text-sm font-semibold text-text-primary">
            Upload JSON (fastest)
          </p>
          <label className="inline-flex cursor-pointer items-center rounded-xl bg-accent-info px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            Choose criticality.json
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <p className="mb-2 mt-5 text-sm font-semibold text-text-primary">
            Or copy to project
          </p>
          <pre className="rounded-lg bg-bg-primary p-3 text-xs text-text-muted">
            {`cp ~/Downloads/493626_criticality.json \\
   public/data/`}
          </pre>
        </div>
      </div>
    );
  }

  const sampleLabels = SAMPLES.map((s) => ({ value: s.id, label: s.label }));

  return (
    <div className="app-shell flex h-screen flex-col overflow-hidden">
      <Header
        city={sampleId}
        cities={sampleLabels.map((s) => s.value)}
        cityLabels={Object.fromEntries(sampleLabels.map((s) => [s.value, s.label]))}
        onCityChange={setSampleId}
        resilienceIndex={isSimulated ? metrics.resilienceIndex : 1.0}
      />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          layers={layers}
          onLayerChange={handleLayerChange}
          scenarios={data.scenarios}
          activeScenario={activeScenario}
          onScenarioSelect={handleScenarioSelect}
          onDisableTopBottleneck={handleDisableTopBottleneck}
          onReset={handleReset}
          topNodeName={data.topGatekeeper?.id}
          isSimulated={isSimulated}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <MapView
              nodes={data.nodes}
              edges={data.edges}
              bounds={data.bounds}
              satelliteUrl={data.satelliteUrl}
              imageId={data.imageId}
              layers={layers}
              disabledNodeIds={disabledNodeIds}
              onNodeClick={handleSimulateNode}
              topGatekeeperId={data.topGatekeeper?.id}
            />
            <ImpactPanel
              metrics={metrics}
              gatekeepers={data.gatekeepers}
              disabledNodeIds={disabledNodeIds}
              onSimulateNode={handleSimulateNode}
            />
          </div>
          <BottomComparison
            isSimulated={isSimulated}
            metrics={metrics}
            disabledNodeId={disabledNodeIds[disabledNodeIds.length - 1]}
            topGatekeeperId={data.topGatekeeper?.id}
            nodes={data.nodes}
            edges={data.edges}
            disabledNodeIds={disabledNodeIds}
          />
        </main>
      </div>
    </div>
  );
}
