import { createContext, useContext } from "react";

export const ToastCtx = createContext(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast inside ToastProvider");
  return ctx;
}
