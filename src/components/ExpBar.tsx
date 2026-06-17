import { motion } from "framer-motion";
import type { PlayerProgress } from "../types/progression";

interface ExpBarProps {
  player: PlayerProgress;
}

export default function ExpBar({ player }: ExpBarProps) {
  const progressRatio = Math.min(1, player.currentLevelExp / player.nextLevelExp);
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <motion.div
      className="exp-bar-shell"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      role="status"
      aria-label="経験値バー"
    >
      <div className="exp-bar-head">
        <p className="exp-level-text">Lv.{player.level}</p>

        <div className="exp-track exp-track-inline" aria-hidden>
          <motion.div
            className="exp-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        </div>

        <p className="exp-progress-text">
          {player.currentLevelExp} / {player.nextLevelExp} EXP
        </p>
      </div>

      <div className="exp-bar-meta">
        <p className="exp-title-text">{player.title}</p>
        <p className="exp-next-text">次のレベルまで {player.nextLevelExp - player.currentLevelExp} EXP</p>
      </div>
    </motion.div>
  );
}