import { createContext, useContext } from "react";

export const ConfettiCtx = createContext(null);

export function useConfetti() {
  const ctx = useContext(ConfettiCtx);
  if (!ctx) throw new Error("useConfetti inside ConfettiProvider");
  return ctx;
}
