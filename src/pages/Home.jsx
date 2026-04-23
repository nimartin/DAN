import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="view">
      <div className="hero">
        <div className="hero__img" aria-hidden="true">
          <img src="/hero.svg" alt="" />
        </div>
        <h2 className="hero__title">
          Bonjour, Princess. <span>✨</span>
        </h2>
        <p className="hero__sub">
          L'argent de Nico n'attend que ton bon goût. On s'offre quoi de beau
          aujourd'hui ?
        </p>
      </div>

      <div className="card card--wallet">
        <div className="wallet__row">
          <span className="wallet__icon">💖</span>
          <span className="wallet__label">Nico's Wallet Balance</span>
        </div>
        <div className="wallet__amount">
          Illimité <span>💖</span>
        </div>
        <Link to="/depense" className="btn btn--primary btn--lg">
          Commencer mon Shopping <span>🛍️</span>
        </Link>
        <div className="wallet__badges">
          <div className="badge-card">
            <div className="badge-card__label">Besties Rank</div>
            <div className="badge-card__value">Top Tier</div>
          </div>
          <div className="badge-card">
            <div className="badge-card__label">Daily Treat</div>
            <div className="badge-card__value">Unlocked</div>
          </div>
        </div>
      </div>

      <p className="quote">
        « Ce n'est pas une dépense, c'est un investissement dans mon bonheur. »
      </p>

      <div className="mode-chip">
        Mode : <strong>Charlotte approved</strong> · CB Nico recommandée
      </div>
    </section>
  );
}
