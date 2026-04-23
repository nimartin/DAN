export default function Wallet() {
  return (
    <section className="view">
      <div className="hero hero--small">
        <h2 className="hero__title">
          Wallet de Nico <span>💳</span>
        </h2>
        <p className="hero__sub">
          Tout ce que la générosité de Nico a à offrir.
        </p>
      </div>

      <div className="card card--wallet">
        <div className="wallet__row">
          <span className="wallet__icon">💖</span>
          <span className="wallet__label">Solde disponible</span>
        </div>
        <div className="wallet__amount">
          Illimité <span>✨</span>
        </div>
        <p className="wallet__note">
          « La CB de Nico vous remercie pour votre créativité. »
        </p>
      </div>

      <div className="card card--receipt">
        <div className="receipt__row receipt__head">
          <span className="receipt__brand">CARTE PRINCIPALE</span>
          <span className="receipt__amount">∞</span>
        </div>
        <div className="receipt__cat">Nico's Black Card</div>
        <div className="receipt__sep" />
        <div className="receipt__row">
          <span className="receipt__k">Numéro</span>
          <span className="receipt__v">•••• 6969</span>
        </div>
        <div className="receipt__row">
          <span className="receipt__k">Plafond</span>
          <span className="receipt__v receipt__v--accent">Aucun 💖</span>
        </div>
        <div className="receipt__row">
          <span className="receipt__k">Approbation</span>
          <span className="receipt__v">Automatique</span>
        </div>
      </div>

      <div className="card card--receipt">
        <div className="receipt__row receipt__head">
          <span className="receipt__brand">CARTE BLOQUÉE</span>
          <span className="receipt__amount">🚫</span>
        </div>
        <div className="receipt__cat">Charlotte's Account</div>
        <div className="receipt__sep" />
        <div className="receipt__row">
          <span className="receipt__k">Numéro</span>
          <span className="receipt__v">•••• 0001</span>
        </div>
        <div className="receipt__row">
          <span className="receipt__k">Plafond</span>
          <span className="receipt__v">Symbolique</span>
        </div>
        <div className="receipt__row">
          <span className="receipt__k">Statut</span>
          <span className="receipt__v receipt__v--accent">
            Inspire, ne paie pas
          </span>
        </div>
      </div>
    </section>
  );
}
