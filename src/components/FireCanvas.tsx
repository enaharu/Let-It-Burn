import type { CSSProperties } from "react";
import type { BurnPhase } from "./BonfireStage";

interface FireCanvasProps {
  phase?: BurnPhase;
  burnProgress?: number;
  className?: string;
  opacity?: number;
}

export default function FireCanvas({
  phase = "idle",
  burnProgress = 0,
  className = "fire-canvas",
  opacity,
}: FireCanvasProps) {
  const opacityByPhase: Record<BurnPhase, number> = {
    idle: 0.35,
    "phase1-drop": 0.75,
    "phase2-char-edge": 0.82,
    "phase3-hole-open": 0.88,
    "phase4-text-burn": 0.95,
    "phase5-ash": 0.86,
    "phase6-gone": 0.7,
  };

  const style: CSSProperties = {
    opacity:
      opacity ??
      (phase === "phase6-gone"
        ? Math.max(0.35, 0.7 - burnProgress * 0.3)
        : opacityByPhase[phase]),
  };

  return (
    <video
      className={className}
      src="/43509_1280x720.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      onLoadedData={(event) => {
        event.currentTarget.play().catch(() => {
          // 自動再生制限時はユーザー操作後に再生される
        });
      }}
      style={style}
    />
  );
}
