import { useState } from "react";
import { motion } from "framer-motion";

interface MoodInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export default function MoodInput({ onSubmit, disabled = false }: MoodInputProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <motion.div
      className="mood-input-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mood-input-inner">
        <h1 className="mood-input-title">今日のモヤモヤ</h1>
        <p className="mood-input-subtitle">
          手放したい気持ちを、紙に書いて炎に包みます
        </p>

        <form onSubmit={handleSubmit} className="mood-input-form">
          <div className="mood-input-field">
            <textarea
              className={`mood-textarea ${isFocused ? "focused" : ""}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="上司が理不尽だった。失敗が悔しい。不安が消えない..."
              maxLength={200}
            />
            <div className="char-count">
              {text.length} / 200
            </div>
          </div>

          <motion.button
            type="submit"
            className="mood-submit-button"
            disabled={!text.trim() || disabled}
            whileHover={{ scale: text.trim() && !disabled ? 1.05 : 1 }}
            whileTap={{ scale: text.trim() && !disabled ? 0.95 : 1 }}
          >
            {disabled ? "燃焼中..." : "紙に書き出す"}
          </motion.button>
        </form>

        <p className="mood-input-hint">
          ※ 書き出すだけで気持ちが軽くなることがあります
        </p>
      </div>
    </motion.div>
  );
}
