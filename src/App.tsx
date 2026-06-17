import { useEffect, useRef, useState } from "react";
import "./App.css";
import MoodInput from "./components/MoodInput";
import BonfireStage from "./components/BonfireStage";
import StatusMessage from "./components/StatusMessage";
import FireCanvas from "./components/FireCanvas";
import ExpBar from "./components/ExpBar";
import AchievementToast from "./components/AchievementToast";
import type { Paper } from "./types/paper";
import type { AchievementDefinition } from "./types/progression";
import { useProgression } from "./hooks/useProgression";

type Phase = "input" | "burning" | "complete";
const MOBILE_BREAKPOINT = 900;

export default function App() {
  const [phase, setPhase] = useState<Phase>("input");
  const [paper, setPaper] = useState<Paper | null>(null);
  const [burnKey, setBurnKey] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const achievementQueueRef = useRef<AchievementDefinition[]>([]);
  const [activeAchievement, setActiveAchievement] =
    useState<AchievementDefinition | null>(null);
  const { player, onBurnCompleted } = useProgression();

  const enqueueAchievements = (achievements: AchievementDefinition[]) => {
    if (achievements.length === 0) {
      return;
    }

    if (!activeAchievement) {
      const [first, ...rest] = achievements;
      setActiveAchievement(first ?? null);
      achievementQueueRef.current.push(...rest);
      return;
    }

    achievementQueueRef.current.push(...achievements);
  };

  const handleSubmit = (text: string) => {
    setPaper({
      id: Date.now().toString(),
      text,
      position: { x: 0, y: 0 },
    });
    setPhase("burning");
    setBurnKey((prev) => prev + 1);
  };

  const handleBurnComplete = () => {
    const completion = onBurnCompleted();
    enqueueAchievements(completion.unlockedAchievements);
    setPhase("complete");
  };

  const handleReset = () => {
    setPhase("input");
    setPaper(null);
    setResetKey((prev) => prev + 1);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  useEffect(() => {
    if (!activeAchievement) {
      return;
    }

    const timer = window.setTimeout(() => {
      const next = achievementQueueRef.current.shift() ?? null;
      setActiveAchievement(next);
    }, 3200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeAchievement]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="app-container forest-bg">
        <header className="exp-bar-anchor">
          <ExpBar player={player} />
        </header>

        <AchievementToast achievement={activeAchievement} />

        {phase === "burning" && (
          <div className="site-bg-layer" aria-hidden>
            <FireCanvas className="site-bg-video" opacity={1} />
          </div>
        )}

        <div className="mobile-layout">
          {phase === "input" && (
            <MoodInput
              key={resetKey}
              onSubmit={handleSubmit}
              disabled={false}
            />
          )}

          {phase === "burning" && (
            <BonfireStage
              paper={paper}
              burnKey={burnKey}
              isActive={true}
              onBurnComplete={handleBurnComplete}
            />
          )}

          {phase === "complete" && (
            <StatusMessage
              visible={true}
              onReset={handleReset}
              text={paper?.text || ""}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container forest-bg">
      <header className="exp-bar-anchor">
        <ExpBar player={player} />
      </header>

      <AchievementToast achievement={activeAchievement} />

      <div className="site-bg-layer" aria-hidden>
        <FireCanvas className="site-bg-video" opacity={1} />
      </div>

      <div className="app-content ritual-layout">
        <section className="panel-left">
          <MoodInput 
            key={resetKey}
            onSubmit={handleSubmit}
            disabled={phase === "burning"}
          />
        </section>

        <section className="panel-center">
          <BonfireStage
            paper={paper}
            burnKey={burnKey}
            isActive={phase === "burning"}
            onBurnComplete={handleBurnComplete}
          />
        </section>

        <section className="panel-right">
          <StatusMessage
            visible={phase === "complete"}
            onReset={handleReset}
            text={paper?.text || ""}
          />
        </section>
      </div>
    </div>
  );
}
