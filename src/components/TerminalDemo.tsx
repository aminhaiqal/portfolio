import { useEffect, useMemo, useRef, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FRAME_MS = 150;

const BUILD_STEPS = [
  "$ axelyn dev init",
  "scaffold workspace........ok",
  "syncing env profiles......ok",
  "registering service links..ok",
  "$ axelyn deploy staging",
  "building release bundle....ok",
  "running post-deploy checks.ok",
  "staging deployment: success",
];

function getBuildFrame(tick: number) {
  const visible = Math.min(BUILD_STEPS.length, Math.floor(tick / 4) + 2);
  const lines = BUILD_STEPS.slice(0, visible);
  const cursor = tick % 8 < 4 ? "_" : " ";

  return ["axelyn-cli@2.1", "", ...lines, "", `ops@studio:${cursor}`].join("\n");
}

function getWaveFrame(tick: number) {
  const width = 44;
  const height = 8;
  const rows: string[] = [];

  for (let y = 0; y < height; y += 1) {
    let row = "";
    for (let x = 0; x < width; x += 1) {
      const p1 = Math.sin((x + tick) / 5);
      const p2 = Math.sin((x + tick) / 9);
      const level = Math.round((p1 + p2) * 1.2 + height / 2 - 0.5);
      row += y === level ? "~" : y === Math.floor(height / 2) ? "-" : " ";
    }
    rows.push(row);
  }

  return [
    "axelyn waveform monitor",
    "",
    ...rows,
    "",
    "$ axelyn status --streams",
    "streams: 12 active | queue: healthy",
  ].join("\n");
}

export default function TerminalDemo() {
  const [mode, setMode] = useState<"build" | "wave">("build");
  const [frame, setFrame] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMediaChange = () => setReducedMotion(media.matches);
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");

    onMediaChange();
    onVisibility();

    media.addEventListener("change", onMediaChange);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      media.removeEventListener("change", onMediaChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !tabVisible) return;

    const loop = () => {
      setFrame((current) => current + 1);
      timerRef.current = window.setTimeout(loop, FRAME_MS);
    };

    timerRef.current = window.setTimeout(loop, FRAME_MS);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [mode, reducedMotion, tabVisible]);

  const content = useMemo(() => {
    const staticTick = mode === "build" ? 24 : 12;
    const tick = reducedMotion ? staticTick : frame;
    return mode === "build" ? getBuildFrame(tick) : getWaveFrame(tick);
  }, [frame, mode, reducedMotion]);

  return (
    <div className="showcase-terminal">
      <div className="showcase-terminal-head" aria-hidden="true">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-amber" />
        <span className="terminal-dot terminal-dot-olive" />
        <p>axelyn-cli session</p>
      </div>

      <Tabs defaultValue="build" onValueChange={(value) => setMode(value as "build" | "wave")}>
        <TabsList>
          <TabsTrigger value="build">Build Log</TabsTrigger>
          <TabsTrigger value="wave">Wave</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="pt-2">
          <pre className="showcase-terminal-pre">{mode === "build" ? content : getBuildFrame(reducedMotion ? 24 : frame)}</pre>
        </TabsContent>

        <TabsContent value="wave" className="pt-2">
          <pre className="showcase-terminal-pre">{mode === "wave" ? content : getWaveFrame(reducedMotion ? 12 : frame)}</pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
