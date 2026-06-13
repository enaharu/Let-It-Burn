import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NotePaper from "./NotePaper";
import AshLayer from "./AshLayer";
import type { Paper } from "../types/paper";

interface BonfireStageProps {
  paper: Paper | null;
  burnKey: number;
  isActive: boolean;
  onBurnComplete: () => void;
}

export type BurnPhase =
  | "idle"
  | "phase1-drop"
  | "phase2-char-edge"
  | "phase3-hole-open"
  | "phase4-text-burn"
  | "phase5-ash"
  | "phase6-gone";

const PHASE_SEQUENCE: BurnPhase[] = [
  "phase1-drop",
  "phase2-char-edge",
  "phase3-hole-open",
  "phase4-text-burn",
  "phase5-ash",
  "phase6-gone",
];

const PHASE_DURATION: Record<BurnPhase, number> = {
  idle: 0,
  "phase1-drop": 500,
  "phase2-char-edge": 800,
  "phase3-hole-open": 1100,
  "phase4-text-burn": 900,
  "phase5-ash": 700,
  "phase6-gone": 450,
};

export default function BonfireStage({
  paper,
  burnKey,
  isActive,
  onBurnComplete,
}: BonfireStageProps) {
  const [phase, setPhase] = useState<BurnPhase>("idle");
  const [burnProgress, setBurnProgress] = useState(0);

  useEffect(() => {
    if (!isActive || !paper) {
      return;
    }

    const starter = window.setTimeout(() => {
      setPhase("phase1-drop");
      setBurnProgress(0);
    }, 0);

    return () => {
      window.clearTimeout(starter);
    };
  }, [burnKey, isActive, paper]);

  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    if (phase === "phase6-gone") {
      const finishTimer = window.setTimeout(() => {
        onBurnComplete();
      }, PHASE_DURATION[phase]);

      return () => {
        window.clearTimeout(finishTimer);
      };
    }

    const duration = PHASE_DURATION[phase];
    if (duration <= 0) {
      return;
    }

    const frameMs = 16;
    const tickTimer = window.setInterval(() => {
      setBurnProgress((prev) => {
        const next = prev + frameMs / duration;
        return Math.min(1, next);
      });
    }, frameMs);

    const nextTimer = window.setTimeout(() => {
      const currentIndex = PHASE_SEQUENCE.indexOf(phase);
      const nextPhase = PHASE_SEQUENCE[currentIndex + 1];
      if (nextPhase) {
        setPhase(nextPhase);
        setBurnProgress(0);
      }
    }, duration);

    return () => {
      window.clearInterval(tickTimer);
      window.clearTimeout(nextTimer);
    };
  }, [phase, onBurnComplete]);

  const showAsh = phase === "phase5-ash" || phase === "phase6-gone";

  return (
    <motion.div
      className="bonfire-stage-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bonfire-stage">
        {isActive && paper && phase !== "idle" && phase !== "phase6-gone" && (
          <NotePaper paper={paper} phase={phase} burnProgress={burnProgress} />
        )}

        {showAsh && (
          <AshLayer burnProgress={burnProgress} phase={phase} />
        )}
      </div>
    </motion.div>
  );
}
