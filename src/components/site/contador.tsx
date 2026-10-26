import { useEffect, useRef, useState } from "react";

/**
 * Número que conta de 0 até o valor quando aparece na tela (da landing).
 * O HTML do servidor já sai com o valor final — o Google e quem está sem
 * JavaScript leem o número certo; a contagem é só um efeito por cima.
 */
export function Contador({
  valor,
  antes = "",
  depois = "",
  duracao = 2400 * 2.2,
}: {
  valor: number;
  antes?: string;
  depois?: string;
  /** Em ms; o padrão segue a "câmera lenta" da landing (2,2×). */
  duracao?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    setAtual(0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const passo = (t: number) => {
          const k = Math.min(1, (t - t0) / duracao);
          setAtual(Math.round(valor * (1 - Math.pow(1 - k, 4))));
          if (k < 1) raf = requestAnimationFrame(passo);
        };
        raf = requestAnimationFrame(passo);
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [valor, duracao]);

  return (
    <span ref={ref}>
      {antes}
      {atual}
      {depois}
    </span>
  );
}
