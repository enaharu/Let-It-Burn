import { motion } from "framer-motion";
import { useState } from "react";

/**
 * BurnAnimation コンポーネント
 * 
 * 紙が焚火に入った直後、6フェーズのアニメーションを実行します：
 * 
 * 1. フェーズ1: 紙が炎に接触（触覚的フィードバック）
 * 2. フェーズ2: 紙が縮小（scale 1 → 0, 1.5秒）
 * 3. フェーズ3: 文字フェードアウト（opacity 1 → 0）
 * 4. フェーズ4: パーティクル生成（火花・灰・煙）
 * 5. フェーズ5: 紙をReact Stateから削除
 * 6. フェーズ6: 完了表示「手放しました」
 * 
 * Props:
 *   - text: 燃やすテキスト
 *   - onAnimationComplete: アニメーション完了時のコールバック
 *   - onIgnite: パーティクル生成のコールバック
 */
type BurnAnimationProps = {
  text: string;
  onAnimationComplete: () => void;
  onIgnite: () => void;
};

export function BurnAnimation({
  text,
  onAnimationComplete,
  onIgnite,
}: BurnAnimationProps) {
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  // フェーズ2/3の縮小・フェードアウトが完了したら、
  // フェーズ4のパーティクル生成を実行
  const handleShrinkComplete = () => {
    onIgnite();  // 焚火で燃える演出
    setShowCompletionMessage(true);

    // フェーズ5: 少し遅延してから状態から削除
    setTimeout(() => {
      onAnimationComplete();
    }, 1000);
  };

  return (
    <>
      {/* フェーズ2 & 3: 紙の縮小とフェードアウト */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 0, opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        onAnimationComplete={handleShrinkComplete}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "#f8f5e9",
            padding: "12px 16px",
            borderRadius: "2px",
            maxWidth: "150px",
            wordBreak: "break-word",
            fontSize: "14px",
            lineHeight: "1.4",
            color: "#0f172a",
          }}
        >
          {text}
        </div>
      </motion.div>

      {/* フェーズ6: 完了メッセージ「手放しました」 */}
      {showCompletionMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "fixed",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          🔥 手放しました 🔥
        </motion.div>
      )}
    </>
  );
}
