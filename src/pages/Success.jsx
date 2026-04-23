import { useMemo } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import {
  SUCCESS_TITLES,
  SUCCESS_QUOTES,
  CAT_MAP,
  formatEuro,
  pick,
} from "../utils.js";

export default function Success() {
  const location = useLocation();
  const entry = location.state?.entry;

  const title = useMemo(() => pick(SUCCESS_TITLES), []);
  const quote = useMemo(() => pick(SUCCESS_QUOTES), []);

  if (!entry) return <Navigate to="/" replace />;

  const cat = CAT_MAP[entry.category];

  return (
    <section className="view view--success">
      <div className="success">
        <div className="success__halo">
          <div className="success__check">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="success__paid">Payé !</div>
          </div>
        </div>
        <p className="success__title">{title}</p>

        <div className="card card--quote">
          <p dangerouslySetInnerHTML={{ __html: quote }} />
        </div>

        <div className="card card--receipt">
          <div className="receipt__row receipt__head">
            <span className="receipt__brand">BOUTIQUE LUXE</span>
            <span className="receipt__amount">{formatEuro(entry.amount)}</span>
          </div>
          <div className="receipt__cat">
            {cat?.icon} {entry.category}
          </div>
          {entry.note && <div className="receipt__note">« {entry.note} »</div>}
          <div className="receipt__sep" />
          <div className="receipt__row">
            <span className="receipt__k">Acheteuse</span>
            <span className="receipt__v">{entry.name}</span>
          </div>
          <div className="receipt__row">
            <span className="receipt__k">Mode de paiement</span>
            <span className="receipt__v">Carte de Nico •••• 6969</span>
          </div>
          <div className="receipt__row">
            <span className="receipt__k">Statut de culpabilité</span>
            <span className="receipt__v receipt__v--accent">Zéro % ✨</span>
          </div>
        </div>

        <Link to="/historique" className="btn btn--primary btn--lg">
          Voir mon historique
        </Link>
        <Link to="/depense" className="btn btn--outlined btn--lg">
          Dépenser plus
        </Link>
      </div>
    </section>
  );
}
