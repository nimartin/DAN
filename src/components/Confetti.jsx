import { useContext, useState, useCallback } from "react";
import { ConfettiCtx } from "./confettiCtx.js";

const COLORS = [
  "#FF007F",
  "#FFB7CE",
  "#FF4DA6",
  "#FFFFFF",
  "#C7005F",
  "#F0E6EF",
];

export function ConfettiProvider({ children }) {
  const [pieces, setPieces] = useState([]);

  const burst = useCallback(() => {
    const next = Array.from({ length: 60 }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      left: Math.random() * 100,
      bg: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 1.6 + Math.random() * 1.6,
      rotate: Math.random() * 360,
      round: Math.random() > 0.5,
    }));
    setPieces((p) => [...p, ...next]);
    setTimeout(() => {
      setPieces((p) => p.filter((x) => !next.find((n) => n.id === x.id)));
    }, 3500);
  }, []);

  return (
    <ConfettiCtx.Provider value={{ burst, pieces }}>
      {children}
    </ConfettiCtx.Provider>
  );
}

export default function Confetti() {
  const ctx = useContext(ConfettiCtx);
  if (!ctx) return null;
  const { pieces } = ctx;
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti__piece"
          style={{
            left: p.left + "%",
            background: p.bg,
            animationDuration: p.duration + "s",
            transform: `rotate(${p.rotate}deg)`,
            borderRadius: p.round ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

