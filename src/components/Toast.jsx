import { useState, useRef, useCallback } from "react";
import { ToastCtx, useToast } from "./toastCtx.js";

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const showToast = useCallback((text) => {
    setMsg(text);
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 3000);
  }, []);

  return (
    <ToastCtx.Provider value={{ msg, visible, showToast }}>
      {children}
    </ToastCtx.Provider>
  );
}

export default function Toast() {
  const { msg, visible } = useToast();
  if (!msg) return null;
  return (
    <div
      className={"toast" + (visible ? " is-visible" : "")}
      role="status"
      aria-live="polite"
    >
      <div className="toast__inner">
        <span className="toast__icon">🚫</span>
        <div>
          <strong>Erreur glamour</strong>
          <p>{msg}</p>
        </div>
      </div>
    </div>
  );
}

