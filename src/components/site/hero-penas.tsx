import { useEffect, useRef } from "react";

// Penas e poeira de luz caindo devagar sobre a foto do hero (vindo da landing
// galinhagsb-landing, out/2026). É só decoração: fica atrás do texto, não
// recebe clique, pausa fora da tela e para de mexer para quem pede menos
// movimento no sistema (prefers-reduced-motion).

const CORES = ["#f7f0e1", "#c98a4b", "#6b3a17", "#2a2118", "#e9d7b0"];
/** "Câmera lenta" da landing (ligada por padrão lá): tudo a ~1/3 da velocidade. */
const VELOCIDADE = 0.32;

type Pena = {
  s: HTMLCanvasElement;
  z: number;
  x: number;
  y: number;
  vy: number;
  fase: number;
  amp: number;
  giro: number;
  rot: number;
  freq: number;
};
type Grao = { x: number; y: number; r: number; v: number; f: number };

function tom(hex: string, p: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (p / 100) * 255)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

/** Desenha uma pena num canvas pequeno, reaproveitado a cada quadro. */
function desenharPena(cor: string) {
  const c = document.createElement("canvas");
  const L = 120;
  c.width = 60;
  c.height = L + 10;
  const g = c.getContext("2d")!;
  g.translate(30, 5);
  const grad = g.createLinearGradient(-22, 0, 22, 0);
  grad.addColorStop(0, tom(cor, -18));
  grad.addColorStop(0.5, cor);
  grad.addColorStop(1, tom(cor, -30));
  g.fillStyle = grad;
  g.beginPath();
  g.moveTo(0, 0);
  g.bezierCurveTo(22, 18, 24, 62, 6, L - 8);
  g.lineTo(0, L);
  g.lineTo(-6, L - 10);
  g.bezierCurveTo(-24, 66, -20, 20, 0, 0);
  g.fill();
  // Fendas entre as barbas da pena
  g.globalCompositeOperation = "destination-out";
  g.lineWidth = 1.2;
  for (let i = 0; i < 9; i++) {
    const y = 22 + i * 10 + Math.random() * 4;
    const lado = Math.random() > 0.5 ? 1 : -1;
    g.beginPath();
    g.moveTo(lado * (12 + Math.random() * 10), y - 2);
    g.lineTo(lado * 1.5, y + 6);
    g.stroke();
  }
  // Raque (haste central)
  g.globalCompositeOperation = "source-over";
  g.strokeStyle = tom(cor, 30);
  g.lineWidth = 1.6;
  g.beginPath();
  g.moveTo(0, 2);
  g.quadraticCurveTo(3, L * 0.5, 0, L + 2);
  g.stroke();
  return c;
}

export function HeroPenas({ qtd = 26, poeira = 70 }: { qtd?: number; poeira?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let mx = 0;
    let my = 0;
    const sprites = CORES.map(desenharPena);

    const tamanho = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    tamanho();

    const nova = (i: number, doTopo: boolean): Pena => {
      const z = 0.35 + Math.random() * 0.9;
      return {
        s: sprites[i % sprites.length],
        z,
        x: Math.random() * W,
        y: doTopo ? -140 - Math.random() * H : Math.random() * H,
        vy: (16 + Math.random() * 22) * z,
        fase: Math.random() * 6.28,
        amp: 30 + Math.random() * 60,
        giro: (Math.random() - 0.5) * 0.9,
        rot: Math.random() * 6.28,
        freq: 0.4 + Math.random() * 0.5,
      };
    };
    const total = W < 700 ? Math.round(qtd * 0.55) : qtd;
    const penas: Pena[] = Array.from({ length: total }, (_, i) => nova(i, false)).sort((a, b) => a.z - b.z);
    const graos: Grao[] = Array.from({ length: poeira }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      v: 4 + Math.random() * 10,
      f: Math.random() * 6.28,
    }));

    // Leve paralaxe: as penas acompanham um pouco o ponteiro.
    const pai = canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    pai?.addEventListener("pointermove", onMove);
    window.addEventListener("resize", tamanho);

    let raf = 0;
    let ativo = true;
    let tAnt = performance.now();
    let tempo = 0;

    const quadro = (t: number) => {
      if (!ativo) return;
      const dt = Math.min(0.05, (t - tAnt) / 1000) * (reduz ? 0 : VELOCIDADE);
      tAnt = t;
      tempo += dt;
      ctx.clearRect(0, 0, W, H);

      // Luz quente pulsando no canto superior direito
      const luz = ctx.createRadialGradient(W * 0.78, H * 0.05, 0, W * 0.78, H * 0.05, H * 0.9);
      luz.addColorStop(0, `rgba(255,214,140,${0.22 + 0.05 * Math.sin(tempo * 0.6)})`);
      luz.addColorStop(1, "rgba(255,214,140,0)");
      ctx.fillStyle = luz;
      ctx.fillRect(0, 0, W, H);

      for (const p of graos) {
        p.y -= (p.v * dt) / H;
        p.f += dt * 0.8;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        ctx.fillStyle = `rgba(255,236,190,${0.25 + 0.35 * Math.abs(Math.sin(p.f))})`;
        ctx.beginPath();
        ctx.arc(p.x * W + Math.sin(p.f) * 12 + mx * 20, p.y * H + my * 12, p.r, 0, 6.283);
        ctx.fill();
      }

      penas.forEach((p, i) => {
        p.y += p.vy * dt;
        p.fase += dt * p.freq;
        p.rot += p.giro * dt;
        if (p.y > H + 140) Object.assign(p, nova(i, true), { z: p.z, s: p.s, y: -140 });
        const x = p.x + Math.sin(p.fase) * p.amp + mx * 60 * p.z;
        const y = p.y + my * 30 * p.z;
        ctx.save();
        ctx.globalAlpha = 0.35 + p.z * 0.55;
        ctx.translate(x, y);
        ctx.rotate(Math.sin(p.fase * 1.3) * 0.6 + p.rot);
        ctx.scale(p.z * 0.75 * (0.8 + 0.2 * Math.cos(p.fase * 2)), p.z * 0.75);
        ctx.drawImage(p.s, -30, -65);
        ctx.restore();
      });

      if (!reduz) raf = requestAnimationFrame(quadro);
    };

    // Pausa quando o hero sai da tela (economiza bateria e CPU).
    const io = new IntersectionObserver(([e]) => {
      ativo = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (ativo) {
        tAnt = performance.now();
        raf = requestAnimationFrame(quadro);
      }
    });
    io.observe(canvas);

    return () => {
      ativo = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      pai?.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", tamanho);
    };
  }, [qtd, poeira]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />;
}
