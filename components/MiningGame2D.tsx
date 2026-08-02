"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Mineral = {
  symbol: string;
  name: string;
  valence: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  weight: number;
  collected?: boolean;
};

const MINERALS: Omit<Mineral, "x" | "y" | "collected">[] = [
  { symbol: "Na", name: "Natri", valence: "I", radius: 34, color: "#ffd166", weight: 1 },
  { symbol: "K", name: "Kali", valence: "I", radius: 30, color: "#ffb84d", weight: 1 },
  { symbol: "Ag", name: "Bạc", valence: "I", radius: 29, color: "#cfe8f3", weight: 1 },
  { symbol: "Mg", name: "Magie", valence: "II", radius: 35, color: "#8bd3c7", weight: 1.25 },
  { symbol: "Ca", name: "Canxi", valence: "II", radius: 36, color: "#91c9f7", weight: 1.3 },
  { symbol: "Zn", name: "Kẽm", valence: "II", radius: 33, color: "#9ec5e6", weight: 1.25 },
  { symbol: "Al", name: "Nhôm", valence: "III", radius: 37, color: "#c5b4e3", weight: 1.45 },
  { symbol: "PO₄", name: "Phosphate", valence: "III", radius: 39, color: "#f6a6c1", weight: 1.6 },
  { symbol: "C", name: "Carbon", valence: "IV", radius: 32, color: "#8093a7", weight: 1.35 },
];

const TARGETS = ["I", "II", "III", "IV"];

export default function MiningGame2D({ compact = false }: { compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef(0);
  const stateRef = useRef({
    running: false,
    score: 0,
    lives: 3,
    combo: 0,
    target: "I",
    angle: -0.55,
    direction: 1,
    length: 82,
    status: "swing" as "swing" | "extend" | "retract",
    caught: null as Mineral | null,
    minerals: [] as Mineral[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    last: 0,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [target, setTarget] = useState("I");
  const [message, setMessage] = useState("Nhấn Bắt đầu để vào mỏ Hóa Trị.");
  const [running, setRunning] = useState(false);

  const spawn = useCallback((width: number, height: number) => {
    const columns = 3;
    stateRef.current.minerals = MINERALS.map((item, index) => ({
      ...item,
      x: width * (0.2 + (index % columns) * 0.3) + (index % 2 ? 10 : -8),
      y: height * (0.48 + Math.floor(index / columns) * 0.19),
      collected: false,
    }));
  }, []);

  const reset = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const state = stateRef.current;
    state.running = true;
    state.score = 0;
    state.lives = 3;
    state.combo = 0;
    state.target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
    state.angle = -0.55;
    state.direction = 1;
    state.length = 82;
    state.status = "swing";
    state.caught = null;
    state.particles = [];
    spawn(rect.width, rect.height);
    setScore(0);
    setLives(3);
    setCombo(0);
    setTarget(state.target);
    setMessage(`Hãy kéo nguyên tố hoặc nhóm có hóa trị ${state.target}.`);
    setRunning(true);
  }, [spawn]);

  const launch = useCallback(() => {
    const state = stateRef.current;
    if (state.running && state.status === "swing") state.status = "extend";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      context.beginPath();
      context.roundRect(x, y, w, h, r);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!stateRef.current.minerals.length) spawn(rect.width, rect.height);
    };

    const drawBackground = (width: number, height: number) => {
      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#e9f7ff");
      sky.addColorStop(0.26, "#c9edfa");
      sky.addColorStop(0.27, "#9b6a45");
      sky.addColorStop(1, "#342b35");
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      context.fillStyle = "rgba(255,255,255,.55)";
      for (let i = 0; i < 5; i++) {
        context.beginPath();
        context.arc(width * (0.1 + i * 0.23), height * 0.1, 18 + (i % 2) * 8, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = "#6c4938";
      context.beginPath();
      context.moveTo(0, height * 0.28);
      for (let x = 0; x <= width; x += 36) {
        context.lineTo(x, height * 0.28 + Math.sin(x * 0.04) * 9);
      }
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();
      context.fill();

      context.strokeStyle = "rgba(255,214,142,.12)";
      context.lineWidth = 2;
      for (let i = 0; i < 9; i++) {
        context.beginPath();
        context.moveTo((i * 137) % width, height * 0.38);
        context.lineTo(((i * 137) % width) + 55, height * 0.9);
        context.stroke();
      }
    };

    const drawRig = (pivotX: number, pivotY: number, hookX: number, hookY: number) => {
      context.strokeStyle = "#f5d8a1";
      context.lineWidth = 4;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(pivotX, pivotY);
      context.lineTo(hookX, hookY);
      context.stroke();

      context.save();
      context.translate(hookX, hookY);
      context.rotate(-stateRef.current.angle);
      context.strokeStyle = "#dbe8ef";
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(0, -7);
      context.lineTo(0, 12);
      context.quadraticCurveTo(-2, 24, -15, 21);
      context.moveTo(0, 12);
      context.quadraticCurveTo(2, 24, 15, 21);
      context.stroke();
      context.restore();

      context.fillStyle = "#f3aa2d";
      roundedRect(pivotX - 52, pivotY - 30, 104, 34, 12);
      context.fill();
      context.strokeStyle = "#0b365e";
      context.lineWidth = 3;
      context.stroke();
      context.fillStyle = "#0b365e";
      context.font = '800 13px "Be Vietnam Pro", sans-serif';
      context.textAlign = "center";
      context.fillText("MỎ HÓA TRỊ", pivotX, pivotY - 8);
    };

    const drawMineral = (mineral: Mineral) => {
      if (mineral.collected) return;
      context.save();
      context.translate(mineral.x, mineral.y);
      context.shadowColor = "rgba(0,0,0,.28)";
      context.shadowBlur = 10;
      context.shadowOffsetY = 5;
      context.fillStyle = mineral.color;
      context.strokeStyle = "#fff8dc";
      context.lineWidth = 3;
      context.beginPath();
      const points = 10;
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const radius = mineral.radius * (i % 2 ? 0.84 : 1);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      context.fill();
      context.stroke();
      context.shadowColor = "transparent";
      context.fillStyle = "#0b365e";
      context.font = `900 ${mineral.symbol.length > 2 ? 17 : 22}px "Be Vietnam Pro", sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(mineral.symbol, 0, -5);
      context.font = '800 10px "Be Vietnam Pro", sans-serif';
      context.fillText(`HT ${mineral.valence}`, 0, 15);
      context.restore();
    };

    const feedback = (mineral: Mineral, good: boolean) => {
      const state = stateRef.current;
      if (good) {
        state.score += 100 + state.combo * 20;
        state.combo += 1;
        setMessage(`Chính xác: ${mineral.symbol} có hóa trị ${mineral.valence}.`);
      } else {
        state.lives -= 1;
        state.combo = 0;
        setMessage(`${mineral.symbol} có hóa trị ${mineral.valence}, chưa đúng mục tiêu ${state.target}.`);
      }
      for (let i = 0; i < (reducedMotion ? 5 : 14); i++) {
        state.particles.push({
          x: mineral.x,
          y: mineral.y,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 4,
          life: 1,
          color: good ? "#ffd166" : "#ef6b6b",
        });
      }
      setScore(state.score);
      setLives(state.lives);
      setCombo(state.combo);
    };

    const animate = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const state = stateRef.current;
      const delta = Math.min(0.032, (now - (state.last || now)) / 1000);
      state.last = now;
      const pivotX = width / 2;
      const pivotY = Math.max(54, height * 0.15);

      if (state.running) {
        if (state.status === "swing") {
          state.angle += state.direction * delta * 1.2;
          if (state.angle > 1.05 || state.angle < -1.05) state.direction *= -1;
        } else {
          const speed = state.status === "extend" ? 310 : 230 / Math.max(1, state.caught?.weight || 1);
          state.length += (state.status === "extend" ? 1 : -1) * speed * delta;
          const hookX = pivotX + Math.sin(state.angle) * state.length;
          const hookY = pivotY + Math.cos(state.angle) * state.length;
          if (state.status === "extend") {
            const hit = state.minerals.find((mineral) =>
              !mineral.collected && Math.hypot(hookX - mineral.x, hookY - mineral.y) < mineral.radius + 16
            );
            if (hit) {
              state.caught = hit;
              feedback(hit, hit.valence === state.target);
              state.status = "retract";
            } else if (hookX < 12 || hookX > width - 12 || hookY > height - 12) {
              state.status = "retract";
            }
          }
          if (state.caught) {
            state.caught.x = hookX;
            state.caught.y = hookY + 18;
          }
          if (state.status === "retract" && state.length <= 82) {
            if (state.caught) state.caught.collected = true;
            state.length = 82;
            state.caught = null;
            state.status = "swing";
            if (state.lives <= 0 || state.minerals.filter((item) => !item.collected).length <= 2) {
              state.running = false;
              setRunning(false);
              setMessage(state.lives <= 0 ? "Hết lượt. Hãy thử lại nhé!" : "Hoàn thành lượt đào!");
            } else {
              state.target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
              setTarget(state.target);
            }
          }
        }
      }

      drawBackground(width, height);
      state.minerals.forEach(drawMineral);
      const hookX = pivotX + Math.sin(state.angle) * state.length;
      const hookY = pivotY + Math.cos(state.angle) * state.length;
      drawRig(pivotX, pivotY, hookX, hookY);

      state.particles = state.particles.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.12;
        particle.life -= 0.025;
        if (particle.life <= 0) return false;
        context.globalAlpha = particle.life;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, 3.5, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const onPointer = () => launch();
    const onKey = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        launch();
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    resize();
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationRef.current);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [launch, spawn]);

  return (
    <section className={`mining-game-2d${compact ? " is-compact" : ""}`} aria-label="Game Đào Hóa Trị 2D">
      <header>
        <div>
          <span>GAME HỌC TẬP 2D</span>
          <h1>Đào Hóa Trị</h1>
          <p>Canh móc, kéo đúng nguyên tố và ghi nhớ hóa trị qua từng lượt chơi.</p>
        </div>
        <button type="button" onClick={reset}>{running ? "Chơi lại" : "Bắt đầu"}</button>
      </header>
      <div className="mining-hud" aria-live="polite">
        <span><small>Mục tiêu</small><b>Hóa trị {target}</b></span>
        <span><small>Điểm</small><b>{score}</b></span>
        <span><small>Combo</small><b>x{combo}</b></span>
        <span><small>Lượt</small><b>{"● ".repeat(lives).trim() || "—"}</b></span>
      </div>
      <div className="mining-canvas-shell">
        <canvas ref={canvasRef} width={960} height={560} aria-label="Mỏ Hóa Trị 2D; chạm để thả móc" />
        <button type="button" className="mining-drop" onClick={launch} disabled={!running}>Thả móc</button>
      </div>
      <p className="mining-feedback" aria-live="polite">{message}</p>
      <style jsx>{`
        .mining-game-2d{width:min(100%,1000px);margin:auto;padding:18px;border:1px solid #b7d9ea;border-radius:22px;background:#f6fbfe;color:#0b365e;box-shadow:0 18px 44px rgba(11,54,94,.14)}
        header{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:14px}
        header span{color:#d06000;font-size:10px;font-weight:900;letter-spacing:.13em}
        h1{margin:3px 0;font-size:clamp(24px,4vw,38px);line-height:1.1}
        header p{margin:0;color:#526c80;font-size:13px;line-height:1.5}
        button{min-height:46px;border:0;border-radius:13px;background:#ffd166;color:#0b365e;font:900 13px "Be Vietnam Pro",sans-serif;cursor:pointer;box-shadow:0 6px 14px rgba(201,139,0,.2)}
        header button{padding:0 20px}
        button:focus-visible{outline:3px solid #168be0;outline-offset:3px}
        .mining-hud{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:9px}
        .mining-hud span{padding:8px 11px;border:1px solid #d4e7f1;border-radius:12px;background:#fff}
        .mining-hud small,.mining-hud b{display:block}.mining-hud small{color:#6a8192;font-size:9px;font-weight:800;text-transform:uppercase}.mining-hud b{margin-top:2px;font-size:14px}
        .mining-canvas-shell{position:relative;overflow:hidden;border:3px solid #0b365e;border-radius:18px;background:#342b35}
        canvas{display:block;width:100%;height:auto;aspect-ratio:12/7;touch-action:manipulation}
        .mining-drop{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);min-width:150px;padding:0 20px}
        .mining-drop:disabled{cursor:not-allowed;opacity:.55}
        .mining-feedback{min-height:44px;margin:9px 0 0;padding:11px 14px;border-radius:12px;background:#e8f5fb;font-size:12px;font-weight:700}
        .is-compact{padding:12px}.is-compact header{margin-bottom:9px}.is-compact header p{font-size:12px}
        @media(max-width:600px){.mining-game-2d{padding:9px;border-radius:16px}header{align-items:flex-start}header p{display:none}header button{padding:0 14px}.mining-hud{grid-template-columns:repeat(2,1fr);gap:5px}.mining-hud span{padding:6px 8px}canvas{aspect-ratio:4/3}.mining-drop{bottom:8px}.mining-feedback{font-size:11px}}
        @media(prefers-reduced-motion:reduce){button{transition:none}}
      `}</style>
    </section>
  );
}
