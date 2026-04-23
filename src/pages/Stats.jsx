import { useMemo } from "react";
import { useStore } from "../store.jsx";
import { CAT_MAP, CHART_QUOTES, formatEuro, pick } from "../utils.js";

export default function Stats() {
  const { state } = useStore();

  const { byCat, total, topCat } = useMemo(() => {
    const counts = {};
    state.expenses.forEach((e) => {
      if (!counts[e.category]) counts[e.category] = { count: 0, total: 0 };
      counts[e.category].count++;
      counts[e.category].total += e.amount;
    });
    const total = state.expenses.reduce((s, e) => s + e.amount, 0);
    const top = Object.entries(counts).sort(
      (a, b) => b[1].count - a[1].count,
    )[0];
    return { byCat: counts, total, topCat: top ? top[0] : null };
  }, [state.expenses]);

  const quote = useMemo(() => pick(CHART_QUOTES), [state.expenses.length]);

  return (
    <section className="view">
      <div className="card card--total">
        <div className="total__label">TABLEAU DE BORD ✨</div>
        <div className="total__amount">{formatEuro(total)}</div>
        <div className="total__pill">Stats de Charlotte 💖</div>
      </div>

      <div className="section-head">
        <h3>
          Analyses Live <span>💖</span>
        </h3>
        <span className="section-head__sub">CE MOIS-CI</span>
      </div>

      <div className="card card--chart">
        <div className="chart-wrap">
          <Donut byCat={byCat} total={total} />
          <ul className="legend">
            {Object.keys(byCat).length === 0 && (
              <li style={{ color: "#6A3A55", fontStyle: "italic" }}>
                Aucune donnée pour l'instant.
              </li>
            )}
            {Object.entries(byCat).map(([cat, data]) => {
              const c = CAT_MAP[cat];
              const pct = total ? Math.round((data.total / total) * 100) : 0;
              return (
                <li key={cat}>
                  <span
                    className="dot"
                    style={{ background: c?.color || "#FF007F" }}
                  />
                  {cat}
                  <span className="pct">{pct}%</span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="chart-quote">{quote}</p>
      </div>

      <div className="section-head">
        <h3>
          Highlights <span>📊</span>
        </h3>
        <span className="section-head__sub">FUN FACTS</span>
      </div>

      <div className="stats-fun">
        <div className="stat-row">
          <span>💸 Dépenses financées</span>
          <b>{state.expenses.length}</b>
        </div>
        <div className="stat-row">
          <span>🚫 Tentatives Charlotte refusées</span>
          <b>{state.refusedAttempts}</b>
        </div>
        <div className="stat-row">
          <span>⭐ Catégorie favorite</span>
          <b>{topCat ? `${CAT_MAP[topCat]?.icon} ${topCat}` : "—"}</b>
        </div>
        {topCat && (
          <div className="stat-row">
            <span>{CAT_MAP[topCat]?.label}</span>
            <b>{byCat[topCat].count}×</b>
          </div>
        )}
        <div className="stat-row">
          <span>💎 Total ruiné chez Nico</span>
          <b>{formatEuro(total)}</b>
        </div>
      </div>
    </section>
  );
}

function Donut({ byCat, total }) {
  const cx = 60,
    cy = 60,
    r = 42,
    sw = 16;
  const C = 2 * Math.PI * r;

  if (total === 0) {
    return (
      <svg
        viewBox="0 0 120 120"
        width="140"
        height="140"
        aria-label="Répartition par catégorie"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#FFE3EE"
          strokeWidth={sw}
        />
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontFamily="Epilogue"
          fontSize="12"
          fill="#6A3A55"
        >
          Vide
        </text>
      </svg>
    );
  }

  let offset = 0;
  const arcs = Object.entries(byCat).map(([cat, data]) => {
    const frac = data.total / total;
    const len = C * frac;
    const color = CAT_MAP[cat]?.color || "#FF007F";
    const arc = (
      <circle
        key={cat}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeDasharray={`${len} ${C - len}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    );
    offset += len;
    return arc;
  });

  return (
    <svg
      viewBox="0 0 120 120"
      width="140"
      height="140"
      aria-label="Répartition par catégorie"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#FFE3EE"
        strokeWidth={sw}
      />
      {arcs}
    </svg>
  );
}
