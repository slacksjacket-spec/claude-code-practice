// 紙吹雪（canvas）。prefers-reduced-motion では出さない。
const COLS = ["#FF5A36", "#FFC933", "#22C1A0", "#3D5AFE", "#FF7AB6", "#8BD450"];
interface Part { x: number; y: number; vx: number; vy: number; r: number; vr: number; c: string; s: number; life: number }

let cv: HTMLCanvasElement | null = null;
let cx: CanvasRenderingContext2D | null = null;
let parts: Part[] = [];
let raf = 0;

function size() {
  if (!cv) return;
  cv.width = innerWidth * devicePixelRatio;
  cv.height = innerHeight * devicePixelRatio;
}

export function mountConfetti() {
  cv = document.createElement("canvas");
  cv.id = "confetti";
  document.body.prepend(cv);
  cx = cv.getContext("2d");
  size();
  addEventListener("resize", size);
}

export function confetti(n: number) {
  if (!cx || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < n; i++)
    parts.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 12 - 4,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      c: COLS[i % COLS.length], s: 6 + Math.random() * 6, life: 0,
    });
  if (!raf) raf = requestAnimationFrame(tick);
}

function tick() {
  const c = cx!;
  c.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  c.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.life < 160 && p.y < innerHeight + 40);
  for (const p of parts) {
    p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
    c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore();
  }
  raf = parts.length ? requestAnimationFrame(tick) : 0;
  if (!raf) c.clearRect(0, 0, innerWidth, innerHeight);
}
