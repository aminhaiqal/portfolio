import { useMemo, useState } from "react";

type Preset = {
  name: string;
  traffic: number;
  complexity: number;
  resilience: number;
};

const PRESETS: Preset[] = [
  { name: "Balanced", traffic: 420, complexity: 48, resilience: 72 },
  { name: "Launch Spike", traffic: 860, complexity: 56, resilience: 64 },
  { name: "Enterprise Core", traffic: 680, complexity: 72, resilience: 84 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function StudioLab() {
  const [traffic, setTraffic] = useState(420);
  const [complexity, setComplexity] = useState(48);
  const [resilience, setResilience] = useState(72);

  const metrics = useMemo(() => {
    const throughput = Math.round(traffic * (1 - complexity / 170) * (1 + resilience / 250));
    const latency = clamp(Math.round(580 - resilience * 3.3 + complexity * 5.1 + traffic / 9), 80, 1200);
    const reliability = clamp(
      Number((97.4 + resilience / 14 - complexity / 55 - traffic / 2300).toFixed(2)),
      90,
      99.99,
    );
    const releaseRisk = clamp(Math.round(complexity * 0.75 + (100 - resilience) * 0.6 + traffic / 20), 5, 95);

    return { throughput, latency, reliability, releaseRisk };
  }, [traffic, complexity, resilience]);

  const qualityBand =
    metrics.reliability >= 99.2 && metrics.latency <= 240
      ? "Production-grade"
      : metrics.reliability >= 98.5 && metrics.latency <= 380
        ? "Stabilizing"
        : "At risk";

  const applyPreset = (preset: Preset) => {
    setTraffic(preset.traffic);
    setComplexity(preset.complexity);
    setResilience(preset.resilience);
  };

  return (
    <section className="studio-lab" aria-labelledby="studio-lab-heading">
      <div className="studio-lab-head">
        <h3 id="studio-lab-heading">System Performance Lab</h3>
        <p>Tune constraints in real time to simulate how architecture decisions impact speed and stability.</p>
      </div>

      <div className="lab-presets" role="list" aria-label="Simulation presets">
        {PRESETS.map((preset) => (
          <button key={preset.name} type="button" onClick={() => applyPreset(preset)}>
            {preset.name}
          </button>
        ))}
      </div>

      <div className="lab-grid">
        <div className="lab-controls">
          <label htmlFor="traffic">
            Traffic load
            <span>{traffic} req/min</span>
          </label>
          <input
            id="traffic"
            type="range"
            min={120}
            max={1200}
            step={20}
            value={traffic}
            onChange={(event) => setTraffic(Number(event.target.value))}
          />

          <label htmlFor="complexity">
            Workflow complexity
            <span>{complexity}%</span>
          </label>
          <input
            id="complexity"
            type="range"
            min={20}
            max={90}
            step={1}
            value={complexity}
            onChange={(event) => setComplexity(Number(event.target.value))}
          />

          <label htmlFor="resilience">
            Platform resilience
            <span>{resilience}%</span>
          </label>
          <input
            id="resilience"
            type="range"
            min={30}
            max={95}
            step={1}
            value={resilience}
            onChange={(event) => setResilience(Number(event.target.value))}
          />
        </div>

        <div className="lab-metrics" aria-live="polite">
          <article>
            <p>Throughput</p>
            <h4>{metrics.throughput.toLocaleString()} req/min</h4>
          </article>
          <article>
            <p>P95 Latency</p>
            <h4>{metrics.latency} ms</h4>
          </article>
          <article>
            <p>Reliability</p>
            <h4>{metrics.reliability}%</h4>
          </article>
          <article>
            <p>Release risk</p>
            <h4>{metrics.releaseRisk}%</h4>
          </article>
        </div>
      </div>

      <div className="lab-status" role="status">
        <span className="status-pill">{qualityBand}</span>
        <p>
          Current simulation suggests a <strong>{qualityBand.toLowerCase()}</strong> operating profile based on load,
          complexity, and resilience settings.
        </p>
      </div>
    </section>
  );
}
