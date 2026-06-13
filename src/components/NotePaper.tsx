import { motion } from "framer-motion";
import type { Paper } from "../types/paper";
import type { BurnPhase } from "./BonfireStage";

interface NotePaperProps {
  paper: Paper | null;
  phase: BurnPhase;
  burnProgress: number;
}

const PAPER_W = 292;
const PAPER_H = 204;
const PAPER_BOTTOM = 400;
const DROP_START_Y = -230;
const DROP_END_Y = -60;
const REST_Y = -56;
const PAPER_OFFSET_X = 0;;

function seededNoise(seedBase: number, index: number) {
  const x = Math.sin((seedBase + 1) * (index + 17) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function NotePaper({ paper, phase, burnProgress }: NotePaperProps) {
  const safePaper =
    paper ??
    ({
      id: "empty-paper",
      text: "",
      position: { x: 0, y: 0 },
    } as Paper);

  const seedBase = Number.parseInt(safePaper.id, 10) || 11;
  const boundaryPoints: number[] = [];
  for (let i = 0; i < 17; i += 1) {
    boundaryPoints.push(seededNoise(seedBase, i));
  }

  let burnLevel = 1;
  if (phase === "phase1-drop") burnLevel = 0;
  if (phase === "phase2-char-edge") burnLevel = 0.12 * burnProgress;
  if (phase === "phase3-hole-open") burnLevel = 0.12 + 0.45 * burnProgress;
  if (phase === "phase4-text-burn") burnLevel = 0.57 + 0.18 * burnProgress;
  if (phase === "phase5-ash") burnLevel = 0.75 + 0.2 * burnProgress;

  const textBurn =
    phase === "phase4-text-burn"
      ? burnProgress
      : phase === "phase5-ash" || phase === "phase6-gone"
        ? 1
        : 0;

  const topLineBase = PAPER_H - PAPER_H * burnLevel;
  const boundaryPath = boundaryPoints
    .map((n, i) => {
      const x = (PAPER_W / (boundaryPoints.length - 1)) * i;
      const wave = Math.sin(i * 0.9 + burnLevel * 8) * 7;
      const y = Math.min(
        PAPER_H - 8,
        Math.max(8, topLineBase + (n - 0.5) * 24 + wave)
      );
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const maskPath = `${boundaryPath} L ${PAPER_W} ${PAPER_H} L 0 ${PAPER_H} Z`;

  const paperMotion = {
    y:
      phase === "phase1-drop"
        ? DROP_START_Y + burnProgress * (DROP_END_Y - DROP_START_Y)
        : phase === "phase2-char-edge"
          ? DROP_END_Y + burnProgress * 4
          : REST_Y,
    rotate:
      phase === "phase1-drop"
        ? -8 + burnProgress * 8
        : phase === "phase2-char-edge"
          ? 0.6
          : 0,
    opacity:
      phase === "phase5-ash"
        ? 1 - burnProgress * 0.85
        : phase === "phase6-gone"
          ? 0
          : 1,
    scale:
      phase === "phase5-ash"
        ? 1 - burnProgress * 0.28
        : phase === "phase6-gone"
          ? 0.7
          : 1,
  };

  const holeOpacity =
    phase === "phase3-hole-open" || phase === "phase4-text-burn" || phase === "phase5-ash"
      ? Math.min(0.9, 0.35 + burnProgress * 0.55)
      : 0;

  const chars = safePaper.text.split("");

  return (
    <div
      style={{
        position: "fixed",
        left: `calc(50% + ${PAPER_OFFSET_X}px)`,
        bottom: `${PAPER_BOTTOM}px`,
        transform: "translateX(-50%)",
        zIndex: 30,
      }}
    >
    <motion.div
      className="note-paper"
      animate={paperMotion}
      transition={{ duration: 0.08, ease: "linear" }}
    >
      <div className="paper-base ritual-paper" style={{ width: PAPER_W, height: PAPER_H }}>
        <svg className="paper-burn-svg" viewBox={`0 0 ${PAPER_W} ${PAPER_H}`}>
          <defs>
            <mask id={`paper-mask-${safePaper.id}`}>
              <rect width={PAPER_W} height={PAPER_H} fill="white" />
              {burnLevel > 0.02 && <path d={maskPath} fill="black" />}
              {burnLevel > 0.26 && (
                <>
                  <circle
                    cx={PAPER_W * 0.28}
                    cy={PAPER_H * 0.74 - burnLevel * 28}
                    r={8 + burnLevel * 20}
                    fill="black"
                  />
                  <circle
                    cx={PAPER_W * 0.58}
                    cy={PAPER_H * 0.66 - burnLevel * 18}
                    r={6 + burnLevel * 16}
                    fill="black"
                  />
                  <circle
                    cx={PAPER_W * 0.79}
                    cy={PAPER_H * 0.78 - burnLevel * 22}
                    r={5 + burnLevel * 14}
                    fill="black"
                  />
                </>
              )}
            </mask>
          </defs>

          <rect
            width={PAPER_W}
            height={PAPER_H}
            fill="rgba(20,14,10,0.82)"
            mask={`url(#paper-mask-${safePaper.id})`}
            opacity={holeOpacity}
          />
          <path d={maskPath} fill="rgba(25,18,12,0.66)" opacity={burnLevel > 0.04 ? 1 : 0} />
          <path d={maskPath} fill="none" stroke="rgba(255,160,95,0.8)" strokeWidth="2.1" />
        </svg>

        <p className="paper-text burn-text" aria-label="burning-text">
          {chars.map((char, index) => {
            if (char === "\n") {
              return <br key={`${safePaper.id}-br-${index}`} />;
            }

            const threshold = index / Math.max(chars.length - 1, 1);
            const charFade = Math.max(0, Math.min(1, (textBurn - threshold + 0.14) * 5));
            const opacity = 1 - charFade;

            return (
              <span
                key={`${safePaper.id}-char-${index}`}
                style={{
                  opacity,
                  color: `rgba(44, 29, 18, ${opacity})`,
                  filter: `blur(${charFade * 0.9}px)`,
                  transform: `translateY(${charFade * 6}px)`,
                  display: "inline-block",
                  transition: "opacity 60ms linear, filter 60ms linear, transform 60ms linear",
                }}
              >
                {char === " " ? "\u00a0" : char}
              </span>
            );
          })}
        </p>
      </div>
    </motion.div>
    </div>
  );
}
