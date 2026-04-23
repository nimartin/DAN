import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store.jsx";
import { useToast } from "../components/toastCtx.js";
import { useConfetti } from "../components/confettiCtx.js";
import { CATEGORIES, REFUSED_MSGS, pick, formatEuro } from "../utils.js";

const STEPS = [
  { key: "category", label: "Plaisir" },
  { key: "amount", label: "Montant" },
  { key: "identity", label: "Identité" },
  { key: "payment", label: "Paiement" },
];

export default function FormPage() {
  const navigate = useNavigate();
  const { addExpense, incrRefused } = useStore();
  const { showToast } = useToast();
  const { burst } = useConfetti();

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    category: null,
    amount: "",
    name: "",
    note: "",
    payment: "nico",
  });
  const [hint, setHint] = useState("");
  const [shake, setShake] = useState(false);

  function update(patch) {
    setData((d) => ({ ...d, ...patch }));
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  }

  function next() {
    setHint("");
    if (step === 0 && !data.category) {
      setHint("Choisis une catégorie de plaisir ✨");
      return;
    }
    if (step === 1) {
      const amt = parseFloat(data.amount);
      if (!amt || amt <= 0) {
        setHint("Un petit montant pour ruiner Nico ?");
        return;
      }
    }
    if (step === 2 && !data.name.trim()) {
      setHint("Princess, ton prénom 💖");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setHint("");
    if (step === 0) navigate("/");
    else setStep((s) => s - 1);
  }

  async function validate() {
    if (data.payment === "charlotte") {
      incrRefused();
      showToast(pick(REFUSED_MSGS));
      triggerShake();
      return;
    }
    const entry = {
      id: Date.now(),
      name: data.name.trim(),
      category: data.category,
      amount: parseFloat(data.amount),
      note: data.note.trim(),
      payment: "CB de Nico",
      date: new Date().toISOString(),
    };
    addExpense(entry);
    burst();
    navigate("/succes", { state: { entry } });
  }

  function onAmountChange(v) {
    let cleaned = v.replace(/[^0-9.,]/g, "").replace(",", ".");
    const parts = cleaned.split(".");
    if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");
    update({ amount: cleaned });
  }

  return (
    <section className="view">
      <div className="hero hero--small">
        <h2 className="hero__title">
          Treat Yourself, Princess <span>✨</span>
        </h2>
        <p className="hero__sub">
          Étape {step + 1} / {STEPS.length} — {STEPS[step].label}
        </p>
      </div>

      <Stepper current={step} />

      <div className={"stepper-body" + (shake ? " is-shaking" : "")}>
        {step === 0 && <StepCategory data={data} update={update} />}
        {step === 1 && (
          <StepAmount data={data} onAmountChange={onAmountChange} />
        )}
        {step === 2 && <StepIdentity data={data} update={update} />}
        {step === 3 && (
          <StepPayment data={data} update={update} setHint={setHint} />
        )}
      </div>

      <p className="form-hint" aria-live="polite">
        {hint}
      </p>

      <div className="stepper-actions">
        <button type="button" className="btn btn--outlined" onClick={back}>
          {step === 0 ? "‹ Annuler" : "‹ Retour"}
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn btn--primary" onClick={next}>
            Suivant ›
          </button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={validate}>
            Faire payer Nico 💳
          </button>
        )}
      </div>

      {step > 0 && <Recap data={data} />}
    </section>
  );
}

/* ============ Sub-components ============ */

function Stepper({ current }) {
  return (
    <div className="stepper">
      {STEPS.map((s, i) => (
        <div
          key={s.key}
          className={
            "stepper__item" +
            (i < current ? " is-done" : "") +
            (i === current ? " is-current" : "")
          }
        >
          <div className="stepper__dot">{i < current ? "✓" : i + 1}</div>
          <div className="stepper__label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function StepCategory({ data, update }) {
  return (
    <>
      <div className="section-title">Catégorie du moment</div>
      <div className="cat-grid" role="radiogroup" aria-label="Catégorie">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            className={
              "cat-card" + (data.category === c.key ? " is-active" : "")
            }
            onClick={() => update({ category: c.key })}
          >
            <span className="cat-card__icon">{c.icon}</span>
            <span>{c.key}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function StepAmount({ data, onAmountChange }) {
  const presets = [10, 25, 50, 100, 250, 500];
  return (
    <>
      <div className="card card--input">
        <label className="field-label" htmlFor="amount">
          Combien on dépense ?
        </label>
        <div className="amount-wrap">
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={data.amount}
            onChange={(e) => onAmountChange(e.target.value)}
            autoComplete="off"
            autoFocus
          />
          <span className="amount-currency">€</span>
        </div>
      </div>
      <div className="section-title">Suggestions de Princesse</div>
      <div className="preset-grid">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            className={
              "preset-chip" +
              (parseFloat(data.amount) === p ? " is-active" : "")
            }
            onClick={() => onAmountChange(String(p))}
          >
            {p} €
          </button>
        ))}
      </div>
    </>
  );
}

function StepIdentity({ data, update }) {
  return (
    <>
      <div className="card card--input">
        <label className="field-label">Ton prénom</label>
        <input
          type="text"
          placeholder="Princess..."
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          autoComplete="given-name"
          autoFocus
        />
      </div>
      <div className="card card--input">
        <label className="field-label">Petit mot doux (optionnel)</label>
        <input
          type="text"
          placeholder="📝 Pourquoi tu mérites ça ?"
          value={data.note}
          onChange={(e) => update({ note: e.target.value })}
          autoComplete="off"
        />
      </div>
    </>
  );
}

function StepPayment({ data, update, setHint }) {
  return (
    <>
      <div className="section-title">Source de financement</div>
      <div
        className="pay-toggle"
        role="radiogroup"
        aria-label="Moyen de paiement"
      >
        <button
          type="button"
          className={
            "pay-card pay-card--nico" +
            (data.payment === "nico" ? " is-active" : "")
          }
          onClick={() => {
            update({ payment: "nico" });
            setHint("");
          }}
        >
          <div className="pay-card__top">
            <span className="pay-card__label">CB DE NICO</span>
            <span className="pay-card__free">Gratuit ✨</span>
          </div>
          <div className="pay-card__name">Nico's Account</div>
          <div className="pay-card__num">•••• •••• •••• 6969</div>
        </button>
        <button
          type="button"
          className={
            "pay-card pay-card--charlotte" +
            (data.payment === "charlotte" ? " is-active" : "")
          }
          onClick={() => {
            update({ payment: "charlotte" });
            setHint("Mauvais choix, Princess 💔");
          }}
        >
          <div className="pay-card__top">
            <span className="pay-card__label">CB DE CHARLOTTE</span>
            <span className="pay-card__free pay-card__free--no">Payant 😬</span>
          </div>
          <div className="pay-card__name">Charlotte's Account</div>
          <div className="pay-card__num">•••• •••• •••• 0001</div>
        </button>
      </div>
    </>
  );
}

function Recap({ data }) {
  const cat = CATEGORIES.find((c) => c.key === data.category);
  const amt = parseFloat(data.amount);
  return (
    <div className="recap">
      <div className="recap__row">
        <span>{cat?.icon}</span>
        <span>{data.category || "—"}</span>
      </div>
      {amt > 0 && (
        <div className="recap__row recap__amount">{formatEuro(amt)}</div>
      )}
      {data.name && (
        <div className="recap__row recap__name">par {data.name}</div>
      )}
    </div>
  );
}
