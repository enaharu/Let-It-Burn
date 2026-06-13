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
  decay: number;          // 寿命減衰率
  type: "spark" | "ash" | "smoke";  // パーティクルの種類
  color: string;          // 色
  size: number;           // サイズ
  turbulence: number;     // 揺らぎ係数
  seed: number;           // 個体差を出すランダムシード
};

const FIRE_BASE_Y_OFFSET = 120;
const AMBIENT_SPARK_TARGET = 160;

function createAmbientSpark(viewWidth: number, viewHeight: number): Particle {
  const flameColors = ["#ff4d00", "#ff7a00", "#ffb000", "#ffd166"];
  const life = 0.35 + Math.random() * 0.65;

  return {
    x: viewWidth / 2 + (Math.random() - 0.5) * 130,
    y: viewHeight - FIRE_BASE_Y_OFFSET + Math.random() * 55,
    vx: (Math.random() - 0.5) * 0.9,
    vy: -(1.2 + Math.random() * 2.6),
    life,
    decay: 0.003 + Math.random() * 0.006,
    type: "spark",
    color: flameColors[Math.floor(Math.random() * flameColors.length)],
    size: Math.random() * 3.2 + 1.2,
    turbulence: 0.02 + Math.random() * 0.05,
    seed: Math.random() * Math.PI * 2,
  };
}

function createAmbientSmoke(viewWidth: number, viewHeight: number): Particle {
  const life = 0.35 + Math.random() * 0.35;

  return {
    x: viewWidth / 2 + (Math.random() - 0.5) * 90,
    y: viewHeight - FIRE_BASE_Y_OFFSET + Math.random() * 30,
    vx: (Math.random() - 0.5) * 0.55,
    vy: -(0.8 + Math.random() * 1.1),
    life,
    decay: 0.0025 + Math.random() * 0.003,
    type: "smoke",
    color: "rgba(190, 190, 190, 0.3)",
    size: Math.random() * 4 + 2.5,
    turbulence: 0.01 + Math.random() * 0.025,
    seed: Math.random() * Math.PI * 2,
  };
}

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
    for (let i = 0; i < AMBIENT_SPARK_TARGET; i++) {
      flameParticles.push(createAmbientSpark(window.innerWidth, window.innerHeight));
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
        decay: 0.012 + Math.random() * 0.02,
        type: "spark",
        color: ["#ff4500", "#ff8800", "#ffcc00", "#ffe066"][
          Math.floor(Math.random() * 4)
        ],
        size: Math.random() * 2 + 1,
        turbulence: 0.03 + Math.random() * 0.08,
        seed: Math.random() * Math.PI * 2,
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
        decay: 0.01 + Math.random() * 0.012,
        type: "ash",
        color: "#888888",
        size: Math.random() * 2 + 0.5,
        turbulence: 0.015 + Math.random() * 0.03,
        seed: Math.random() * Math.PI * 2,
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
        decay: 0.006 + Math.random() * 0.007,
        type: "smoke",
        color: "rgba(200, 200, 200, 0.3)",
        size: Math.random() * 4 + 2,
        turbulence: 0.012 + Math.random() * 0.02,
        seed: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  // アニメーションループ
  useEffect(() => {
    const animate = () => {
      const current = particlesRef.current;
      const now = performance.now();

      // 各パーティクルを更新
      const updated = current
        .map((p) => {
          const sway = Math.sin(now * 0.003 + p.seed + p.y * 0.01) * p.turbulence;

          // 位置を更新
          const x = p.x + p.vx + sway;
          const y = p.y + p.vy;

          // タイプごとの運動モデル
          let vx = p.vx;
          let vy = p.vy;
          let size = p.size;

          if (p.type === "spark") {
            // 炎は上昇しながら細くなる
            vy -= 0.01;
            vx *= 0.985;
            size *= 0.996;
          } else if (p.type === "ash") {
            // 灰は重力で落下
            vy += 0.05;
            vx *= 0.99;
          } else {
            // 煙はゆっくり拡散
            vx *= 1.002;
            size *= 1.004;
          }

          // 寿命を減らす
          const life = Math.max(0, p.life - p.decay);

          return {
            ...p,
            x,
            y,
            vx,
            vy,
            life,
            size,
          };
        })
        .filter((p) => p.life > 0); // 寿命が尽きたパーティクルを削除

      let sparkCount = updated.filter((p) => p.type === "spark").length;
      while (sparkCount < AMBIENT_SPARK_TARGET) {
        updated.push(createAmbientSpark(window.innerWidth, window.innerHeight));
        sparkCount += 1;
      }

      if (Math.random() < 0.55) {
        updated.push(createAmbientSmoke(window.innerWidth, window.innerHeight));
      }

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
