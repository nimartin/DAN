import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { isRemoteEnabled, fetchRemote, pushRemote } from "./remote.js";

const LS_KEY = "dan.state.v1";
const defaultState = { expenses: [], refusedAttempts: 0 };
const POLL_MS = 4000;
const PUSH_DEBOUNCE_MS = 400;

const StoreCtx = createContext(null);

function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

// Fusion : on déduplique par id, on garde le max de refusedAttempts
function mergeStates(a, b) {
  const map = new Map();
  [...(a.expenses || []), ...(b.expenses || [])].forEach((e) =>
    map.set(e.id, e),
  );
  const expenses = Array.from(map.values()).sort((x, y) => y.id - x.id);
  return {
    expenses,
    refusedAttempts: Math.max(a.refusedAttempts || 0, b.refusedAttempts || 0),
  };
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadLocal);
  const [syncStatus, setSyncStatus] = useState(
    isRemoteEnabled ? "syncing" : "local",
  );
  const stateRef = useRef(state);
  stateRef.current = state;
  const pushTimerRef = useRef(null);
  const inFlightRef = useRef(false);

  // Persist local
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // Boot : pull remote + merge
  useEffect(() => {
    if (!isRemoteEnabled) return;
    let mounted = true;
    (async () => {
      try {
        const remote = await fetchRemote();
        if (!mounted || !remote) return;
        const merged = mergeStates(stateRef.current, remote);
        setState(merged);
        // si on avait des données locales pas encore poussées, on push (sans bloquer)
        if (JSON.stringify(merged) !== JSON.stringify(remote)) {
          schedulePush();
        }
        setSyncStatus("online");
      } catch (e) {
        console.warn("[DAN] Sync init failed", e);
        setSyncStatus("offline");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Polling périodique
  useEffect(() => {
    if (!isRemoteEnabled) return;
    const id = setInterval(async () => {
      try {
        const remote = await fetchRemote();
        if (!remote) return;
        const merged = mergeStates(stateRef.current, remote);
        if (JSON.stringify(merged) !== JSON.stringify(stateRef.current)) {
          setState(merged);
        }
        setSyncStatus("online");
      } catch {
        setSyncStatus("offline");
      }
    }, POLL_MS);
    return () => clearInterval(id);
  }, []);

  // Push debouncé + non bloquant : on planifie un PUT, et on en relance un
  // après si une nouvelle mutation arrive pendant un PUT en cours.
  function schedulePush() {
    if (!isRemoteEnabled) return;
    if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    pushTimerRef.current = setTimeout(runPush, PUSH_DEBOUNCE_MS);
  }

  async function runPush() {
    if (!isRemoteEnabled) return;
    if (inFlightRef.current) {
      // un push en cours -> on rebranche un debounce derrière
      pushTimerRef.current = setTimeout(runPush, PUSH_DEBOUNCE_MS);
      return;
    }
    inFlightRef.current = true;
    const snapshot = stateRef.current;
    setSyncStatus("syncing");
    try {
      await pushRemote(snapshot);
      // si l'état a bougé pendant le push, on repush
      if (snapshot !== stateRef.current) {
        inFlightRef.current = false;
        schedulePush();
        return;
      }
      setSyncStatus("online");
    } catch (e) {
      console.warn("[DAN] Push failed", e);
      setSyncStatus("offline");
    } finally {
      inFlightRef.current = false;
    }
  }

  const addExpense = useCallback((entry) => {
    setState((s) => ({ ...s, expenses: [entry, ...s.expenses] }));
    schedulePush();
  }, []);

  const incrRefused = useCallback(() => {
    setState((s) => ({ ...s, refusedAttempts: s.refusedAttempts + 1 }));
    schedulePush();
  }, []);

  const reset = useCallback(() => {
    setState({ ...defaultState });
    schedulePush();
  }, []);

  return (
    <StoreCtx.Provider
      value={{
        state,
        syncStatus,
        isRemoteEnabled,
        addExpense,
        incrRefused,
        reset,
      }}
    >
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
