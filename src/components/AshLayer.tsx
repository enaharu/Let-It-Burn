import { motion } from "framer-motion";
import type { BurnPhase } from "./BonfireStage";

interface AshLayerProps {
  burnProgress: number;
  phase: BurnPhase;
}

export default function AshLayer({ burnProgress, phase }: AshLayerProps) {
  // 灰のパーティクル位置を計算
  const generateAshParticles = () => {
    const particles = [];
    const count = Math.floor(burnProgress * 20); // 進行に応じて増加

    for (let i = 0; i < count; i++) {
      const seed = i * 12.9898;
      const angle = ((seed % 1) * Math.sin(seed * 78.233) % 1) * Math.PI * 2;
      const distance = ((seed * 43758.5453) % 1) * 80 * burnProgress;

      particles.push({
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - burnProgress * 60,
        opacity: Math.max(0, 1 - burnProgress * 1.5),
        size: 2 + ((seed * 43758.5453) % 1) * 4,
      });
    }
    return particles;
  };

  const ashParticles = generateAshParticles();

  return (
    <motion.div
      className="ash-layer"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      {ashParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="ash-particle"
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: particle.opacity,
          }}
          transition={{
            duration: 0.1,
          }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: `rgba(150, 150, 150, ${0.6 * particle.opacity})`,
            borderRadius: "50%",
            boxShadow: `0 0 ${particle.size}px rgba(100, 100, 100, ${0.4 * particle.opacity})`,
          }}
        />
      ))}

      {phase === "phase5-ash" && burnProgress > 0.45 && (
        <motion.div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: "translateY(100px)",
            fontSize: "14px",
            color: "rgba(200, 190, 175, 0.7)",
            whiteSpace: "nowrap",
            fontStyle: "italic",
          }}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 0.75, y: 100 }}
          transition={{ duration: 0.5 }}
        >
          灰が舞って消えていく...
        </motion.div>
      )}
    </motion.div>
  );
}
