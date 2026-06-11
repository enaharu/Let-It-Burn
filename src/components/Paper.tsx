import { motion, type PanInfo } from "framer-motion";

/**
 * Paper コンポーネント
 * 
 * ユーザーが入力したテキストを「紙」として表示し、
 * ドラッグして焚火に投げ込める要素です。
 * 
 * Props:
 *   - id: 紙の一意ID
 *   - text: 表示するテキスト
 *   - onDrop: 焚火に入ったときのコールバック
 *   - isActive: ドラッグ操作を受け付けるかどうか
 */
type PaperProps = {
  id: string;
  text: string;
  onDrop: (id: string) => void;
  isActive: boolean;
};

export function Paper({ id, text, onDrop, isActive }: PaperProps) {
  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    // 焚火エリアは画面下部（y > window.innerHeight - 150）に配置
    // 焚火の中心はwindow.innerWidth / 2付近
    const fireBottomY = window.innerHeight - 150;
    const fireTopY = window.innerHeight - 250;
    const fireLeftX = window.innerWidth / 2 - 100;
    const fireRightX = window.innerWidth / 2 + 100;

    // 紙の終端位置が焚火エリアに重なったかをチェック
    if (
      info.point.y > fireTopY &&
      info.point.y < fireBottomY &&
      info.point.x > fireLeftX &&
      info.point.x < fireRightX
    ) {
      onDrop(id);
    }
  };

  return (
    <motion.div
      drag={isActive}  // ドラッグを許可するかどうか
      dragElastic={0.2}  // ドラッグ後の跳ね返り
      onDragEnd={handleDragEnd}
      initial={{ opacity: 1, scale: 1 }}
      style={{
        position: "fixed",
        top: "50px",
        left: "30px",
        cursor: isActive ? "grab" : "default",
      }}
      whileDrag={{ scale: 1.05 }}  // ドラッグ中は少し大きく
    >
      <div
        style={{
          backgroundColor: "#f8f5e9",  // クリーム色の紙
          padding: "12px 16px",
          borderRadius: "2px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          maxWidth: "150px",
          wordBreak: "break-word",
          fontSize: "14px",
          lineHeight: "1.4",
          color: "#0f172a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {text}
      </div>
    </motion.div>
  );
}
