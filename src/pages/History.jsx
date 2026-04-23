import { useMemo, useRef, useState } from "react";
import { useStore } from "../store.jsx";
import { useToast } from "../components/toastCtx.js";
import { CAT_MAP, formatEuro, formatDate } from "../utils.js";

const RESET_CODE = "TIMON";

export default function History() {
  const { state, reset } = useStore();
  const { showToast } = useToast();
  const dialogRef = useRef(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  const total = useMemo(
    () => state.expenses.reduce((s, e) => s + e.amount, 0),
    [state.expenses],
  );

  function openReset() {
    setCode("");
    setCodeError(false);
    if (dialogRef.current?.showModal) dialogRef.current.showModal();
  }
  function onConfirm(e) {
    if (code.trim().toUpperCase() !== RESET_CODE) {
      e.preventDefault();
      setCodeError(true);
      showToast("Mauvais code, Princess. Demande à Nico 💃");
      return;
    }
    reset();
    showToast("Mémoire effacée. Nouvelle vie commence ✨");
  }

  return (
    <section className="view">
      <div className="card card--total">
        <div className="total__label">TOTAL DÉPENSÉ PAR NICO 💎</div>
        <div className="total__amount">{formatEuro(total)}</div>
        <div className="total__pill">
          # {state.expenses.length} achat{state.expenses.length > 1 ? "s" : ""}{" "}
          de Princesse validé{state.expenses.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="section-head">
        <h3>
          Shopping Bag <span>🛍️</span>
        </h3>
        <span className="section-head__sub">
          {state.expenses.length} ITEM{state.expenses.length > 1 ? "S" : ""}
        </span>
      </div>

      <ul className="hist-list">
        {state.expenses.length === 0 && (
          <li className="hist-empty">
            Aucune dépense pour l'instant. Allez Princess, on s'y met. 💅
          </li>
        )}
        {state.expenses.map((e) => {
          const cat = CAT_MAP[e.category];
          return (
            <li key={e.id} className="hist-item">
              <div
                className="hist-item__icon"
                style={{ background: (cat?.color || "#FFB7CE") + "22" }}
              >
                {cat?.icon || "✨"}
              </div>
              <div className="hist-item__main">
                <p className="hist-item__title">
                  {e.name} — {e.category}
                </p>
                <p className="hist-item__sub">
                  {formatDate(e.date)}
                  {e.note ? " · " + e.note : ""}
                </p>
              </div>
              <div className="hist-item__right">
                <div className="hist-item__amount">-{formatEuro(e.amount)}</div>
                <div className="hist-item__pay">NICO'S CARD</div>
              </div>
            </li>
          );
        })}
      </ul>

      <button className="btn btn--reset" onClick={openReset}>
        <span>↺ Tout oublier (Reset)</span>
        <small>Recommencer à zéro pour une nouvelle session shopping</small>
      </button>

      <dialog ref={dialogRef} className="dialog">
        <form method="dialog" className="dialog__form">
          <h3>Tu es sûre, Princess ? 💔</h3>
          <p>
            Tout ton historique de shopping va disparaître. Nico, lui, restera.
          </p>
          <p className="dialog__hint">
            Pour confirmer, tape le code secret&nbsp;:
          </p>
          <input
            type="text"
            className={"input dialog__code" + (codeError ? " is-error" : "")}
            placeholder="CODE SECRET"
            value={code}
            onChange={(ev) => {
              setCode(ev.target.value);
              setCodeError(false);
            }}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="dialog__actions">
            <button value="cancel" className="btn btn--outlined">
              Annuler
            </button>
            <button
              value="confirm"
              className="btn btn--primary"
              onClick={onConfirm}
            >
              Tout oublier
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
