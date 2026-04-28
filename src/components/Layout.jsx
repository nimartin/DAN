import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import Sparkles from "./Sparkles.jsx";
import Toast, { ToastProvider } from "./Toast.jsx";
import Confetti, { ConfettiProvider } from "./Confetti.jsx";
import { useStore } from "../store.jsx";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { syncStatus, isRemoteEnabled } = useStore();
  const isHome = location.pathname === "/";
  const isSuccess = location.pathname === "/succes";

  const syncDot = !isRemoteEnabled
    ? { c: "#FFB7CE", t: "Local uniquement" }
    : syncStatus === "online"
      ? { c: "#3DD68C", t: "Synchronisé" }
      : syncStatus === "syncing"
        ? { c: "#FFB347", t: "Synchronisation…" }
        : { c: "#FF4D4D", t: "Hors ligne" };

  return (
    <ToastProvider>
      <ConfettiProvider>
        <Sparkles />
        <main className="app">
          <header className="topbar">
            {!isHome ? (
              <button
                className="topbar__back"
                onClick={() => navigate(-1)}
                aria-label="Retour"
              >
                ‹
              </button>
            ) : (
              <span
                className="topbar__back"
                aria-hidden="true"
                style={{ visibility: "hidden" }}
              >
                ‹
              </span>
            )}
            <h1 className="topbar__logo">
              <img src="/logo.png" alt="DAN" className="topbar__logo-img" />
            </h1>
            <div className="topbar__icons">
              <span
                className="sync-dot"
                style={{ background: syncDot.c }}
                title={syncDot.t}
                aria-label={syncDot.t}
              />
              <span aria-hidden="true">💖</span>
            </div>
          </header>

          <Outlet />

          {!isSuccess && (
            <nav className="tabbar" aria-label="Navigation principale">
              <Tab to="/" icon="🛍️" label="SHOPPING" />
              <Tab to="/wallet" icon="💳" label="WALLET" />
              <Tab to="/historique" icon="🧾" label="HISTORY" center />
              <Tab to="/stats" icon="📈" label="STATS" />
            </nav>
          )}
        </main>
        <Toast />
        <Confetti />
      </ConfettiProvider>
    </ToastProvider>
  );
}

function Tab({ to, icon, label, center }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        "tab" + (isActive ? " is-active" : "") + (center ? " tab--center" : "")
      }
    >
      <span className="tab__icon">{icon}</span>
      <span className="tab__label">{label}</span>
    </NavLink>
  );
}
