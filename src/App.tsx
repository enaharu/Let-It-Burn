import { useState } from "react";
import "./App.css";
import MoodInput from "./components/MoodInput";
import BonfireStage from "./components/BonfireStage";
import StatusMessage from "./components/StatusMessage";
import FireCanvas from "./components/FireCanvas";
import type { Paper } from "./types/paper";

type Phase = "input" | "burning" | "complete";

export default function App() {
  const [phase, setPhase] = useState<Phase>("input");
  const [paper, setPaper] = useState<Paper | null>(null);
  const [burnKey, setBurnKey] = useState(0);

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
    setPhase("complete");
  };

  const handleReset = () => {
    setPhase("input");
    setPaper(null);
  };

  return (
    <div className="app-container forest-bg">
      <div className="site-bg-layer" aria-hidden>
        <FireCanvas className="site-bg-video" opacity={1} />
      </div>

      <div className="app-content ritual-layout">
        <section className="panel-left">
          <MoodInput onSubmit={handleSubmit} disabled={phase === "burning"} />
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
