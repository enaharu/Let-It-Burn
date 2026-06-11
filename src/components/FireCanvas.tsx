import { useEffect, useRef } from "react";

/**
 * FireCanvas コンポーネント
 * 
 * useFireParticles から受け取ったパーティクル配列を
 * Canvas上に描画します。
 * 
 * Props:
 *   - particles: 描画するパーティクル配列
 */
type FireCanvasProps = {
  particles: Array<{
    x: number;
    y: number;
    life: number;
    type: "spark" | "ash" | "smoke";
    color: string;
    size: number;
  }>;
};

export function FireCanvas({ particles }: FireCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // キャンバスをウィンドウサイズに合わせる
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 背景色を描画（夜のキャンプ場）
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 各パーティクルを描画
    particles.forEach((p) => {
      ctx.save();

      // 透明度を寿命に応じて変える（消えゆく演出）
      ctx.globalAlpha = p.life;

      // パーティクルの色を設定
      ctx.fillStyle = p.color;

      // 円形で描画
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }, [particles]);

  // ウィンドウリサイズに対応
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none", // Canvas自体はクリックを通す
        zIndex: 1,
      }}
    />
  );
}
