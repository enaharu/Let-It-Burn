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
const PAPER_OFFSET_X = 0;

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

  const holeCount = 24;
  const holes = Array.from({ length: holeCount }, (_, i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const xNoise = seededNoise(seedBase + 101, i);
    const yNoise = seededNoise(seedBase + 233, i);
    const sizeNoise = seededNoise(seedBase + 367, i);
    const openNoise = seededNoise(seedBase + 421, i);
    const x01 = (col + 0.16 + xNoise * 0.68) / 6;
    const y01 = (row + 0.14 + yNoise * 0.72) / 4;

    return {
      cx: PAPER_W * (0.08 + x01 * 0.84),
      cy: PAPER_H * (0.1 + y01 * 0.84),
      baseRadius: 2.4 + sizeNoise * 5.8,
      openThreshold: 0.22 + y01 * 0.52 + openNoise * 0.09,
    };
  });

  const heatRotateOffset =
    phase === "phase3-hole-open" ||
    phase === "phase4-text-burn" ||
    phase === "phase5-ash" ||
    phase === "phase6-gone"
      ? Math.sin((burnProgress + seededNoise(seedBase, 97)) * 7.4) * 0.55
      : 0;

  const heatScaleOffset =
    phase === "phase3-hole-open" ||
    phase === "phase4-text-burn" ||
    phase === "phase5-ash" ||
    phase === "phase6-gone"
      ? 1 + Math.sin((burnProgress + seededNoise(seedBase, 141)) * 6.8) * 0.008
      : 1;

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
          : heatRotateOffset,
    opacity:
      phase === "phase5-ash"
        ? 1 - burnProgress * 0.85
        : phase === "phase6-gone"
          ? 0
          : 1,
    scale:
      phase === "phase5-ash"
        ? (1 - burnProgress * 0.28) * heatScaleOffset
        : phase === "phase6-gone"
          ? 0.7 * heatScaleOffset
          : heatScaleOffset,
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
                  {holes.map((hole, i) => {
                    const openLevel = Math.max(
                      0,
                      Math.min(1, (burnLevel - hole.openThreshold) / 0.45)
                    );
                    const radius = hole.baseRadius * openLevel * (0.8 + burnLevel * 0.9);

                    if (radius < 0.2) {
                      return null;
                    }

                    return (
                      <circle
                        key={`${safePaper.id}-hole-${i}`}
                        cx={hole.cx}
                        cy={hole.cy - burnLevel * 11}
                        r={radius}
                        fill="black"
                      />
                    );
                  })}
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
          <path
            d={boundaryPath}
            fill="none"
            stroke="rgba(16,11,8,0.9)"
            strokeWidth="5.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={burnLevel > 0.04 ? 0.96 : 0}
          />
          <path
            d={boundaryPath}
            fill="none"
            stroke="rgba(95,58,31,0.84)"
            strokeWidth="3.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={burnLevel > 0.04 ? 0.92 : 0}
          />
          <path
            d={boundaryPath}
            fill="none"
            stroke="rgba(255,170,96,0.82)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 3px rgba(255,140,75,0.55))" }}
            opacity={burnLevel > 0.04 ? 0.95 : 0}
          />
        </svg>

        <p className="paper-text burn-text" aria-label="burning-text">
          {chars.map((char, index) => {
            if (char === "\n") {
              return <br key={`${safePaper.id}-br-${index}`} />;
            }

            const threshold = seededNoise(seedBase + 500, index);
            const charFade = Math.max(0, Math.min(1, (textBurn - threshold + 0.14) * 5));
            const opacity = 1 - charFade;
            const rotate = (seededNoise(seedBase + 730, index) - 0.5) * 7.5 * charFade;
            const drift = charFade * (4.2 + seededNoise(seedBase + 907, index) * 4.8);
            const blur = charFade * 1.2;
            const glow = 0.18 + charFade * 0.62;

            return (
              <span
                key={`${safePaper.id}-char-${index}`}
                style={{
                  opacity,
                  color: `rgba(44, 29, 18, ${opacity})`,
                  filter: `blur(${blur}px)`,
                  textShadow: `
                    0 0 ${2 + charFade * 10}px rgba(255,140,80,${glow}),
                    0 0 ${6 + charFade * 16}px rgba(255,90,40,${glow * 0.6})
                `,
                  transform: `translateY(${drift}px) rotate(${rotate}deg)`,
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
