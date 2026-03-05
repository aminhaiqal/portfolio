import { useEffect, useMemo, useRef, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FRAME_MS = 30;

function waveFrame(tick: number): string {
  const width = 56;
  const height = 10;
  const lines: string[] = [];

  for (let y = 0; y < height; y += 1) {
    let row = "";
    for (let x = 0; x < width; x += 1) {
      const phase = (x + tick) / 5;
      const amplitude = Math.round(Math.sin(phase) * 2 + height / 2 - 1);
      if (y === amplitude) row += "~";
      else if (y === Math.floor(height / 2)) row += "-";
      else row += " ";
    }
    lines.push(row);
  }

  return [
    "axelyn.wave v1",
    "",
    ...lines,
    "",
    "status: rendering waveform...",
  ].join("\n");
}

const LOG_STEPS = [
  "initializing modules...",
  "compiling api layer...",
  "running integration tests...",
  "deploy complete.",
];

function buildLogFrame(tick: number): string {
  const stepsVisible = Math.min(LOG_STEPS.length, Math.floor(tick / 18) + 1);
  const output = LOG_STEPS.slice(0, stepsVisible);
  const cursor = tick % 20 < 10 ? "_" : " ";

  return [
    "axelyn.build v1",
    "",
    ...output,
    "",
    `> ${cursor}`,
  ].join("\n");
}

export default function AsciiTerminal() {
  const [mode, setMode] = useState<"wave" | "build">("wave");
  const [frame, setFrame] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setIsReducedMotion(media.matches);
    const onVisibility = () => setIsVisible(document.visibilityState === "visible");

    updateMotion();
    onVisibility();

    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion || !isVisible) return;

    const loop = () => {
      setFrame((f) => f + 1);
      rafRef.current = window.setTimeout(loop, FRAME_MS);
    };

    rafRef.current = window.setTimeout(loop, FRAME_MS);

    return () => {
      if (rafRef.current) window.clearTimeout(rafRef.current);
    };
  }, [isReducedMotion, isVisible, mode]);

  const content = useMemo(() => {
    if (isReducedMotion) {
      return mode === "wave" ? waveFrame(0) : buildLogFrame(54);
    }

    return mode === "wave" ? waveFrame(frame) : buildLogFrame(frame);
  }, [frame, isReducedMotion, mode]);

  return (
    <div className="terminal-card rounded-xl border border-border bg-card p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)]">
      <div className="mb-3 flex items-center gap-1.5 border-b border-border/80 pb-3">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-amber" />
        <span className="terminal-dot terminal-dot-olive" />
        <span className="ml-2 text-xs text-muted-foreground">Axelyn Terminal</span>
      </div>

      <Tabs defaultValue="wave" onValueChange={(v) => setMode(v as "wave" | "build")}> 
        <TabsList>
          <TabsTrigger value="wave">Wave animation</TabsTrigger>
          <TabsTrigger value="build">Build log simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="wave" className="pt-3">
          <pre className="ascii-pre">{mode === "wave" ? content : waveFrame(isReducedMotion ? 0 : frame)}</pre>
        </TabsContent>

        <TabsContent value="build" className="pt-3">
          <pre className="ascii-pre">{mode === "build" ? content : buildLogFrame(isReducedMotion ? 54 : frame)}</pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
