import { useState } from "react";
import "./App.css";
import { FireCanvas } from "./components/FireCanvas";
import { Paper } from "./components/Paper";
import { BurnAnimation } from "./components/BurnAnimation";
import { useFireParticles } from "./hooks/useFireParticles";

type Paper = {
  id: string;
  text: string;
};

/**
 * 一意のIDを生成
 */
function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function App() {
  const [draft, setDraft] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [burningPaperId, setBurningPaperId] = useState<string | null>(null);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const { particles, ignite } = useFireParticles();

  /**
   * 紙を生成
   * 
   * 「紙を生成」ボタン押下時：
   * - 入力テキストから新しい紙を生成
   * - 紙をpapers配列に追加
   * - 入力欄をクリア
   */
  const handleGeneratePaper = () => {
    if (!draft.trim() || draft.length > 500) {
      return;
    }

    const newPaper: Paper = {
      id: generateId(),
      text: draft,
    };

    setPapers([...papers, newPaper]);
    setDraft("");
  };

  /**
   * 紙を焚火に投入
   * 
   * 紙がドラッグで焚火エリアに入った直後：
   * - その紙を「燃焼中」として設定
   * - BurnAnimation コンポーネントを表示
   */
  const handleDropOnFire = (paperId: string) => {
    setBurningPaperId(paperId);
  };

  /**
   * 燃焼アニメーション完了時
   * 
   * BurnAnimation の6フェーズが終わった後：
   * - 紙をpapersリストから削除
   * - 完了メッセージを表示
   */
  const handleBurnAnimationComplete = () => {
    setPapers(papers.filter((p) => p.id !== burningPaperId));
    setBurningPaperId(null);
    setShowCompletionMessage(true);

    // 完了メッセージを3秒後に消す
    setTimeout(() => {
      setShowCompletionMessage(false);
    }, 3000);
  };

  /**
   * パーティクル生成時（燃焼中央で発火）
   */
  const handleIgnite = () => {
    ignite(window.innerWidth / 2, window.innerHeight - 150);
  };

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#0f172a",
        fontFamily: "system-ui, sans-serif",
        color: "#ffffff",
        zIndex: 0,
      }}
    >
      {/* 背景のCanvas（焚火と炎パーティクル） */}
      <FireCanvas particles={particles} />

      {/* メインコンテンツ（Canvasの上に配置） */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "40px",
          textAlign: "center",
        }}
      >
        {/* タイトル */}
        <div style={{ marginBottom: "60px" }}>
          <h1 style={{ fontSize: "48px", marginBottom: "10px", margin: 0 }}>
            🔥 Digital Bonfire
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#aaa",
              margin: "10px 0 0 0",
            }}
          >
            今日のモヤモヤを焚火で手放そう
          </p>
        </div>

        {/* 入力フォーム */}
        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "500px",
          }}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, 500))}
            placeholder="モヤモヤ、心配事、未完了タスク..."
            style={{
              width: "100%",
              height: "120px",
              padding: "12px",
              fontSize: "14px",
              border: "2px solid #444",
              borderRadius: "8px",
              backgroundColor: "#1a2332",
              color: "#ffffff",
              fontFamily: "inherit",
              resize: "none",
            }}
            disabled={papers.length > 0 && !burningPaperId}
          />
          <div
            style={{
              fontSize: "12px",
              color: "#888",
              textAlign: "right",
            }}
          >
            {draft.length} / 500
          </div>

          <button
            onClick={handleGeneratePaper}
            disabled={!draft.trim() || draft.length > 500 || papers.length > 0}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: draft.trim() ? "#ff6b35" : "#444",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: draft.trim() ? "pointer" : "not-allowed",
              transition: "background-color 0.2s",
            }}
          >
            📄 紙を生成
          </button>
        </div>

        {/* 生成された紙の表示エリア */}
        {papers.map((paper) => (
          <Paper
            key={paper.id}
            id={paper.id}
            text={paper.text}
            onDrop={handleDropOnFire}
            isActive={!burningPaperId}
          />
        ))}

        {/* 焚火エリア表示（ビジュアル） */}
        <div
          style={{
            marginTop: "80px",
            fontSize: "64px",
            animation: "pulse 1s infinite",
          }}
        >
          🔥
        </div>
        <p
          style={{
            marginTop: "10px",
            fontSize: "14px",
            color: "#aaa",
          }}
        >
          紙をここにドラッグして投入
        </p>

        {/* 燃焼アニメーション */}
        {burningPaperId && (
          <BurnAnimation
            text={papers.find((p) => p.id === burningPaperId)?.text || ""}
            onAnimationComplete={handleBurnAnimationComplete}
            onIgnite={handleIgnite}
          />
        )}

        {/* 完了メッセージ */}
        {showCompletionMessage && (
          <div
            style={{
              position: "fixed",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#fff",
              zIndex: 100,
            }}
          >
            ✨ 手放しました ✨
          </div>
        )}
      </div>

      {/* アニメーション */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </main>
  );
}
