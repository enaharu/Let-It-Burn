import { useEffect, useRef, useState } from "react";

/**
 * パーティクルの型定義
 * 
 * Canvas上で描画する個々の粒子（火花・灰・煙）を表現します
 */
type Particle = {
  x: number;              // 現在のX座標
  y: number;              // 現在のY座標
  vx: number;             // X方向の速度
  vy: number;             // Y方向の速度
  life: number;           // 残り寿命（0-1、0で消滅）
  type: "spark" | "ash" | "smoke";  // パーティクルの種類
  color: string;          // 色
  size: number;           // サイズ
};

/**
 * useFireParticles フック
 * 
 * 背景の炎パーティクル（常時）と、
 * 紙が燃えるときのパーティクル（一時的）を管理します
 */
export function useFireParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // 背景用の炎パーティクルを初期化
  useEffect(() => {
    const flameParticles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      const flameColors = ["#ff4500", "#ff8800", "#ffcc00"];
      flameParticles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
        y: window.innerHeight - 100 + Math.random() * 50,
        vx: (Math.random() - 0.5) * 2,
        vy: -1 - Math.random() * 2,
        life: Math.random(),
        type: "spark",
        color: flameColors[Math.floor(Math.random() * 3)],
        size: Math.random() * 3 + 1,
      });
    }
    particlesRef.current = flameParticles;
  }, []);

  /**
   * 紙が焚火に燃焼するときにパーティクルを生成
   * 
   * このメソッドを外部から呼び出して、新しいパーティクルを追加します
   */
  const ignite = (centerX: number, centerY: number) => {
    const newParticles: Particle[] = [];

    // 火花を生成（上方向へ高速移動）
    for (let i = 0; i < 20; i++) {
      const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
      const speed = 3 + Math.random() * 5;
      newParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed),
        life: 1,
        type: "spark",
        color: ["#ff4500", "#ff8800", "#ffcc00"][
          Math.floor(Math.random() * 3)
        ],
        size: Math.random() * 2 + 1,
      });
    }

    // 灰を生成（ランダム移動）
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 1,
        life: 1,
        type: "ash",
        color: "#888888",
        size: Math.random() * 2 + 0.5,
      });
    }

    // 煙を生成（上方向へ拡散）
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 2,
        vy: -2 - Math.random() * 1,
        life: 1,
        type: "smoke",
        color: "rgba(200, 200, 200, 0.3)",
        size: Math.random() * 4 + 2,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  // アニメーションループ
  useEffect(() => {
    const animate = () => {
      const current = particlesRef.current;

      // 各パーティクルを更新
      const updated = current
        .map((p) => {
          // 位置を更新
          const x = p.x + p.vx;
          const y = p.y + p.vy;

          // 重力効果（煙以外）
          let vy = p.vy;
          if (p.type !== "smoke") {
            vy += 0.05;
          }

          // 寿命を減らす
          const life = Math.max(0, p.life - 0.01);

          return {
            ...p,
            x,
            y,
            vy,
            life,
          };
        })
        .filter((p) => p.life > 0); // 寿命が尽きたパーティクルを削除

      particlesRef.current = updated;
      setParticles(updated);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return { particles, ignite };
}
