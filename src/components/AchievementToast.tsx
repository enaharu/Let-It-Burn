import { motion, AnimatePresence } from "framer-motion";
import type { AchievementDefinition } from "../types/progression";

interface AchievementToastProps {
  achievement: AchievementDefinition | null;
}

export default function AchievementToast({ achievement }: AchievementToastProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="achievement-toast"
          initial={{ y: -20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -12, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35 }}
          role="alert"
          aria-live="polite"
        >
          <p className="achievement-badge">実績解除</p>
          <p className="achievement-name">{achievement.name}</p>
          <p className="achievement-reward">+{achievement.rewardExp} EXP</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}