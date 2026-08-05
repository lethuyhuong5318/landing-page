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
  { symbol: "Na", name: "Natri", valence: "I", radius: 25, color: "#ffd166", weight: 1 },
  { symbol: "K", name: "Kali", valence: "I", radius: 23, color: "#ffb84d", weight: 1 },
  { symbol: "Ag", name: "B\u1ea1c", valence: "I", radius: 22, color: "#cfe8f3", weight: 1 },
  { symbol: "Mg", name: "Magie", valence: "II", radius: 26, color: "#8bd3c7", weight: 1.25 },
  { symbol: "Ca", name: "Canxi", valence: "II", radius: 27, color: "#91c9f7", weight: 1.3 },
  { symbol: "Zn", name: "K\u1ebdm", valence: "II", radius: 25, color: "#9ec5e6", weight: 1.25 },
  { symbol: "Al", name: "Nh\u00f4m", valence: "III", radius: 28, color: "#c5b4e3", weight: 1.45 },
  { symbol: "PO\u2084", name: "Phosphate", valence: "III", radius: 29, color: "#f6a6c1", weight: 1.6 },
  { symbol: "C", name: "Carbon", valence: "IV", radius: 24, color: "#8093a7", weight: 1.35 },
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
    length: 120,
    restLength: 120,
    status: "swing" as "swing" | "extend" | "retract" | "quiz",
    caught: null as Mineral | null,
    minerals: [] as Mineral[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    last: 0,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [target, setTarget] = useState("I");
  const [message, setMessage] = useState("Nh\u1ea5n B\u1eaft \u0111\u1ea7u \u0111\u1ec3 v\u00e0o m\u1ecf H\u00f3a Tr\u1ecb.");
  const [running, setRunning] = useState(false);
  const [quizMineral, setQuizMineral] = useState<Mineral | null>(null);

  const spawn = useCallback((width: number, height: number) => {
    // Narrow phones get 2 columns instead of 3 so each nugget keeps a
    // usable tap target and real spacing instead of shrinking into a
    // crowded 3x3 grid. Row spacing is derived from the actual row count
    // (5 rows at 2 columns vs 3 rows at 3 columns) so the last row always
    // lands inside the canvas instead of a fixed 0.16 step overflowing it.
    const columns = width < 480 ? 2 : 3;
    const scale = Math.max(0.8, Math.min(1, width / 640));
    const colPositions = columns === 2 ? [0.3, 0.7] : [0.2, 0.5, 0.8];
    const rows = Math.ceil(MINERALS.length / columns);
    const rowStart = 0.5;
    const rowEnd = 0.88;
    const rowGap = rows > 1 ? (rowEnd - rowStart) / (rows - 1) : 0;
    stateRef.current.minerals = MINERALS.map((item, index) => ({
      ...item,
      x: width * colPositions[index % columns] + (index % 2 ? 8 : -6),
      y: height * (rowStart + Math.floor(index / columns) * rowGap),
      radius: item.radius * scale,
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
    const ropeScale = Math.max(0.8, Math.min(1, rect.width / 640));
    state.restLength = Math.max(88, Math.min(150, rect.height * 0.26)) * ropeScale;
    state.length = state.restLength;
    state.status = "swing";
    state.caught = null;
    state.particles = [];
    spawn(rect.width, rect.height);
    setScore(0);
    setLives(3);
    setCombo(0);
    setTarget(state.target);
    setMessage("H\u00e3y canh d\u00e2y m\u00f3c v\u00e0 ch\u1ecdn m\u1ed9t nguy\u00ean t\u1ed1.");
    setQuizMineral(null);
    setRunning(true);
  }, [spawn]);

  const launch = useCallback(() => {
    const state = stateRef.current;
    if (state.running && state.status === "swing") state.status = "extend";
  }, []);

  const answerQuestion = useCallback((answer: string) => {
    const state = stateRef.current;
    const mineral = state.caught;
    if (!mineral || state.status !== "quiz") return;
    const good = answer === mineral.valence;
    if (good) {
      state.score += 100 + state.combo * 20;
      state.combo += 1;
      setMessage("Ch\u00ednh x\u00e1c! " + mineral.symbol + " c\u00f3 h\u00f3a tr\u1ecb " + mineral.valence + ".");
    } else {
      state.lives -= 1;
      state.combo = 0;
      setMessage(mineral.symbol + " c\u00f3 h\u00f3a tr\u1ecb " + mineral.valence + ". M\u00ecnh th\u1eed l\u1ea1i nh\u00e9!");
    }
    for (let i = 0; i < 12; i++) state.particles.push({x:mineral.x,y:mineral.y,vx:(Math.random()-.5)*4,vy:-Math.random()*4,life:1,color:good?"#ffd166":"#ef6b6b"});
    setScore(state.score); setLives(state.lives); setCombo(state.combo);
    setQuizMineral(null);
    state.status = "retract";
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
      const ropeScale = Math.max(0.8, Math.min(1, rect.width / 640));
      stateRef.current.restLength = Math.max(88, Math.min(150, rect.height * 0.26)) * ropeScale;
      if (stateRef.current.status === "swing") stateRef.current.length = stateRef.current.restLength;
      spawn(rect.width, rect.height);
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

    const drawMinerMascot = (width: number, height: number) => {
      const scale = Math.max(0.62, Math.min(1, width / 720));
      const x = width / 2;
      const y = Math.max(54, height * 0.115);
      context.save();
      context.translate(x, y);
      context.scale(scale, scale);
      context.lineJoin = "round";
      context.lineCap = "round";

      context.fillStyle = "rgba(11,54,94,.2)";
      context.beginPath(); context.ellipse(0, 48, 42, 11, 0, 0, Math.PI * 2); context.fill();
      context.fillStyle = "#163d63";
      roundedRect(-28, 16, 56, 39, 17); context.fill();
      context.fillStyle = "#fff4dc";
      context.beginPath(); context.arc(0, 0, 31, 0, Math.PI * 2); context.fill();
      context.strokeStyle = "#0b365e"; context.lineWidth = 3; context.stroke();
      context.beginPath(); context.arc(-22, -20, 11, 0, Math.PI * 2); context.arc(22, -20, 11, 0, Math.PI * 2); context.fill(); context.stroke();
      context.fillStyle = "#ffc83d";
      context.beginPath(); context.arc(0, -9, 32, Math.PI, 0); context.lineTo(32, -5); context.lineTo(-32, -5); context.closePath(); context.fill(); context.stroke();
      roundedRect(-37, -8, 74, 10, 5); context.fill(); context.stroke();
      context.fillStyle = "#0b365e";
      context.beginPath(); context.arc(-11, 0, 3.5, 0, Math.PI * 2); context.arc(11, 0, 3.5, 0, Math.PI * 2); context.fill();
      context.beginPath(); context.ellipse(0, 10, 7, 5, 0, 0, Math.PI * 2); context.fill();
      context.strokeStyle = "#0b365e"; context.lineWidth = 2;
      context.beginPath(); context.arc(0, 12, 10, .2, Math.PI - .2); context.stroke();
      context.strokeStyle = "#8c5b2f"; context.lineWidth = 5;
      context.beginPath(); context.moveTo(24, 28); context.lineTo(52, 7); context.stroke();
      context.strokeStyle = "#dce9ef"; context.lineWidth = 6;
      context.beginPath(); context.moveTo(44, 3); context.lineTo(57, 13); context.stroke();
      context.restore();
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

      context.fillStyle = "#ffc83d";
      context.strokeStyle = "#0b365e";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(pivotX, pivotY, 9, 0, Math.PI * 2);
      context.fill();
      context.stroke();
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
      context.fillStyle = "#284b67";
      context.font = '700 8px "Be Vietnam Pro", sans-serif';
      context.fillText(mineral.name, 0, 14);
      context.restore();
    };

    const animate = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const state = stateRef.current;
      const delta = Math.min(0.032, (now - (state.last || now)) / 1000);
      state.last = now;
      const pivotX = width / 2;
      const pivotY = Math.max(58, height * 0.13);

      if (state.running) {
        if (state.status === "swing") {
          state.angle += state.direction * delta * 1.2;
          if (state.angle > 1.05 || state.angle < -1.05) state.direction *= -1;
        } else if (state.status !== "quiz") {
          const speed = state.status === "extend" ? 310 : 230 / Math.max(1, state.caught?.weight || 1);
          state.length += (state.status === "extend" ? 1 : -1) * speed * delta;
          const hookX = pivotX + Math.sin(state.angle) * state.length;
          const hookY = pivotY + Math.cos(state.angle) * state.length;
          if (state.status === "extend") {
            const hit = state.minerals.find((mineral) =>
              !mineral.collected && Math.hypot(hookX - mineral.x, hookY - mineral.y) < mineral.radius + 12
            );
            if (hit) {
              state.caught = hit;
              state.status = "quiz";
              setQuizMineral({...hit});
            } else if (hookX < 12 || hookX > width - 12 || hookY > height - 12) {
              state.status = "retract";
            }
          }
          if (state.caught) {
            state.caught.x = hookX;
            state.caught.y = hookY + 18;
          }
          if (state.status === "retract" && state.length <= state.restLength) {
            if (state.caught) state.caught.collected = true;
            state.length = state.restLength;
            state.caught = null;
            state.status = "swing";
            if (state.lives <= 0 || state.minerals.filter((item) => !item.collected).length <= 2) {
              state.running = false;
              setRunning(false);
              setMessage(state.lives <= 0 ? "H\u1ebft l\u01b0\u1ee3t. H\u00e3y th\u1eed l\u1ea1i nh\u00e9!" : "Ho\u00e0n th\u00e0nh l\u01b0\u1ee3t \u0111\u00e0o!");
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
      drawMinerMascot(width, height);

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
    <section className={`mining-game-2d${compact ? " is-compact" : ""}`} aria-label={"Game \u0110\u00e0o H\u00f3a Tr\u1ecb 2D"}>
      <header><div><span>GAME H&#7884;C T&#7852;P 2D</span><h1>&#272;&#224;o H&#243;a Tr&#7883;</h1><p>M&#243;c m&#7897;t nguy&#234;n t&#7889;, ch&#7885;n h&#243;a tr&#7883; &#273;&#250;ng v&#224; chinh ph&#7909;c t&#7915;ng t&#7847;ng m&#7887;.</p></div>{running && <button className="restart-button" type="button" onClick={reset}>Ch&#417;i l&#7841;i</button>}</header>
      <div className="mining-hud" aria-live="polite"><span><small>M&#7909;c ti&#234;u</small><b>{quizMineral ? quizMineral.symbol : "M\u00f3c qu\u1eb7ng"}</b></span><span><small>&#272;i&#7875;m</small><b>{score}</b></span><span><small>Combo</small><b>x{combo}</b></span><span><small>L&#432;&#7907;t</small><b>{"\u25cf ".repeat(lives).trim() || "\u2014"}</b></span></div>
      <div className="mining-canvas-shell">
        <canvas ref={canvasRef} width={960} height={560} aria-label={"M\u1ecf H\u00f3a Tr\u1ecb 2D; ch\u1ea1m \u0111\u1ec3 th\u1ea3 m\u00f3c"} />
        {!running && !quizMineral && <div className="start-overlay"><div className="start-copy"><small>S&#7864;N S&#192;NG KH&#193;M PH&#193;?</small><strong>Ch&#7885;n &#273;&#250;ng h&#243;a tr&#7883;, k&#233;o tr&#7885;n kho b&#225;u!</strong></div><button type="button" className="start-button" onClick={reset}>{score ? "Ch\u01a1i l\u1ea1i" : "B\u1eaft \u0111\u1ea7u ch\u01a1i"}</button></div>}
        {quizMineral && <div className="quiz-overlay" role="dialog" aria-modal="true" aria-labelledby="miningQuestion"><div className="quiz-card"><small>C&#194;U H&#7886;I H&#211;A TR&#7882;</small><strong id="miningQuestion">{quizMineral.symbol} c&#243; h&#243;a tr&#7883; bao nhi&#234;u?</strong><span>{quizMineral.name}</span><div className="answer-grid">{TARGETS.map(value => <button type="button" key={value} onClick={() => answerQuestion(value)}>{value}</button>)}</div></div></div>}
      </div>
      {running && !quizMineral && <button type="button" className="mining-drop" onClick={launch}>Th&#7843; m&#243;c</button>}
      <p className="mining-feedback" aria-live="polite">{message}</p>
      <style jsx>{`
.mining-game-2d{width:min(100%,960px);margin:auto;padding:14px;border:1px solid #b7d9ea;border-radius:22px;background:linear-gradient(145deg,#fffaf0,#eef8fd);color:#0b365e;box-shadow:0 18px 44px rgba(11,54,94,.14)} header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}header span{color:#c95c00;font-size:9px;font-weight:900;letter-spacing:.13em}h1{margin:2px 0;font-size:clamp(22px,3.5vw,32px);line-height:1.1}header p{margin:0;color:#526c80;font-size:12px;line-height:1.45}.restart-button{padding:0 16px} button{min-height:46px;border:0;border-radius:14px;background:#ffc83d;color:#0b365e;font:900 13px "Be Vietnam Pro",sans-serif;cursor:pointer;box-shadow:0 7px 16px rgba(201,139,0,.24);touch-action:manipulation}button:focus-visible{outline:3px solid #168be0;outline-offset:3px}
.mining-hud{display:grid;grid-template-columns:1.35fr repeat(3,1fr);gap:1px;margin-bottom:8px;overflow:hidden;border:1px solid #bfd8e7;border-radius:14px;background:#bfd8e7}.mining-hud span{min-width:0;padding:7px 9px;background:#fff;text-align:center}.mining-hud small,.mining-hud b{display:block;white-space:nowrap}.mining-hud small{color:#6a8192;font-size:7px;font-weight:900;text-transform:uppercase}.mining-hud b{margin-top:1px;overflow:hidden;font-size:12px;text-overflow:ellipsis}.mining-canvas-shell{position:relative;overflow:hidden;border:3px solid #0b365e;border-radius:18px;background:#342b35;box-shadow:inset 0 0 30px rgba(0,0,0,.2)}canvas{display:block;width:100%;height:auto;aspect-ratio:12/7;touch-action:manipulation}.mining-drop{width:100%;margin-top:10px;min-width:0}
.start-overlay,.quiz-overlay{position:absolute;inset:0;z-index:6;display:grid;place-items:center;padding:18px;background:rgba(6,37,65,.5);backdrop-filter:blur(2px);overflow-y:auto}.start-overlay{align-content:center;gap:14px;text-align:center}.start-copy{display:grid;gap:4px;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.35)}.start-copy small{color:#ffe27e;font-size:9px;font-weight:900;letter-spacing:.12em}.start-copy strong{font-size:clamp(16px,3vw,22px)}.start-button{min-width:190px;min-height:56px;padding:0 26px;border:2px solid #fff3bd;border-radius:18px;background:linear-gradient(135deg,#ffd45c,#ff9f1c);font-size:16px;box-shadow:0 12px 28px rgba(103,55,0,.36)}.quiz-card{width:min(360px,100%);max-height:100%;padding:18px;overflow-y:auto;border:2px solid #8ed0f1;border-radius:20px;background:#fffaf0;text-align:center;box-shadow:0 20px 46px rgba(0,0,0,.32)}.quiz-card>small{color:#c95c00;font-size:9px;font-weight:900;letter-spacing:.12em}.quiz-card>strong,.quiz-card>span{display:block}.quiz-card>strong{margin-top:6px;font-size:20px;line-height:1.25}.quiz-card>span{margin-top:2px;color:#657b8c;font-size:11px}.answer-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:15px}.answer-grid button{min-width:0;padding:0;background:#e7f4fb;box-shadow:none}.answer-grid button:hover,.answer-grid button:focus-visible{background:#ffc83d}
.mining-feedback{min-height:42px;margin:8px 0 0;padding:10px 13px;border-radius:12px;background:#e8f5fb;font-size:11px;font-weight:700;line-height:1.5}.is-compact{padding:10px}.is-compact header{margin-bottom:7px}@media(max-width:600px){.mining-game-2d{padding:7px;border-radius:15px}header{align-items:flex-start;margin-bottom:7px}header p{display:none}h1{font-size:21px}.restart-button{min-height:42px;padding:0 11px;font-size:11px}.mining-hud{margin-bottom:6px;border-radius:11px}.mining-hud span{padding:5px 3px}.mining-hud small{font-size:6px}.mining-hud b{font-size:10px}canvas{aspect-ratio:3/4}.mining-drop{min-height:48px}.start-overlay,.quiz-overlay{padding:12px}.start-button{min-width:180px}.quiz-card{padding:15px}.quiz-card>strong{font-size:18px}.answer-grid{gap:6px}.answer-grid button{min-height:48px}.mining-feedback{min-height:38px;margin-top:6px;padding:8px 10px;font-size:10px}}@media(max-width:380px){.mining-game-2d{padding:5px}.mining-hud b{font-size:9px}.quiz-card{padding:12px}.quiz-card>strong{font-size:16px}.answer-grid{grid-template-columns:repeat(2,1fr);gap:6px;margin-top:10px}.answer-grid button{min-height:42px}canvas{aspect-ratio:4/5}}@media(prefers-reduced-motion:reduce){button{transition:none}.start-overlay,.quiz-overlay{backdrop-filter:none}}
      `}</style>
    </section>
  );
}
