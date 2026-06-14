import { motion } from "framer-motion";

interface StatusMessageProps {
  visible: boolean;
  onReset: () => void;
  text: string;
}

export default function StatusMessage({ visible, onReset, text }: StatusMessageProps) {
  if (!visible) {
    return null;
  }

  const normalizeText = text.trim();

  const getResponseMessage = () => {


    if (/不安|怖い|心配/.test(normalizeText)) {
      return {
        summary: "その不安は、\nもう炎の向こうへ流れました。",
        detail: "深呼吸して、\n次の一歩だけを見ていきましょう。",
      };
    }

    if (/怒|理不尽|腹|むか/.test(normalizeText)) {
      return {
        summary: "強い怒りは、\nここで静かに手放せました。",
        detail: "正しさを抱え続けなくても、\n大丈夫です。",
      };
    }

    if (/失敗|ミス|だめ|悔しい/.test(normalizeText)) {
      return {
        summary: "悔しさは、\n燃えて次の力に変わりました。",
        detail: "今日はここで区切って、\n明日へ渡しましょう。",
      };
    }

    if (/疲|しんど|つら|消えたい/.test(normalizeText)) {
      return {
        summary: "疲れきった気持ちは、\nそっと休ませられました。",
        detail: "今は、立ち上がるより\n整えることを優先しましょう。",
      };
    }

    return {
        summary: "今日のモヤモヤは、\nここで静かにほどけました。",
        detail: "言葉にするだけでも、\n気持ちは少し軽くなります。",
      };
  }

  const response = getResponseMessage();

  return (
    <motion.div
      className="status-message-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
      }}
    >
      <motion.div
        className="status-message-inner"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55 }}
        style={{
          textAlign: "center",
          position: "relative",
          padding: "30px 24px",
          borderRadius: "16px",
          background: "rgba(7, 8, 13, 0.42)",
          border: "1px solid rgba(255, 214, 170, 0.25)",
          backdropFilter: "blur(4px)",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: "-100px",
            background:
              "radial-gradient(circle, rgba(255,190,110,0.28) 0%, rgba(255,190,110,0) 72%)",
            pointerEvents: "none",
          }}
          animate={{
            opacity: [0.44, 0.82, 0.44],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        <motion.h2
          className="status-title"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "45px",
            fontWeight: "300",
            color: "#f7d9b6",
            marginBottom: "18px",
            letterSpacing: "3px",
            position: "relative",
            zIndex: 1,
          }}
        >
          手放しました
        </motion.h2>

        <motion.p
          className="status-subtitle"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "18px",
            color: "#f0d7bc",
            marginBottom: "16px",
            position: "relative",
            zIndex: 1,
            whiteSpace: "pre-line",
          }}
        >
          {response.summary}
        </motion.p>

        <motion.p
          className="status-detail"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{
            fontSize: "15px",
            color: "#ead1b3",
            marginBottom: "16px",
            position: "relative",
            zIndex: 1,
            lineHeight: 1.8,
            whiteSpace: "pre-line",
          }}
        >
          {response.detail}
        </motion.p>

        <motion.p
          className="status-input-text"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ duration: 0.45 }}
          style={{
            fontSize: "14px",
            color: "#e3c19b",
            marginBottom: "40px",
            fontStyle: "italic",
            position: "relative",
            zIndex: 1,
            maxWidth: "400px",
            margin: "16px auto 40px",
          }}
        >
          「{text}」
        </motion.p>

        <motion.button
          className="status-reset-button"
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          style={{
            padding: "12px 32px",
            fontSize: "16px",
            backgroundColor: "rgba(245, 178, 114, 0.26)",
            color: "#ffe2c7",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(212, 165, 116, 0.22)",
            position: "relative",
            zIndex: 1,
            transition: "all 0.3s ease",
          }}
        >
          気持ちが軽くなった
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
