// Microcopy + catégories + helpers partagés
export const SUCCESS_TITLES = [
  "Oups, Nico va pleurer...",
  "Paiement approuvé par le service Luxe & Caprices ✨",
  "Nico finance vos rêves depuis toujours.",
  "La CB de Nico vous remercie pour votre créativité.",
  "Charlotte applaudit. Nico transpire.",
  "Encore une victoire pour la team Princesse 💖",
];

export const SUCCESS_QUOTES = [
  "« Mais tes ongles sont absolument <em>magnifiques</em>, Princess ! C'est tout ce qui compte vraiment. »",
  "« Une dépense par jour éloigne le banquier de Nico. »",
  "« Charlotte ne paie pas, elle inspire. »",
  "« Nico dort mieux quand tu te fais plaisir. »",
  "« Investissement émotionnel : <em>validé</em>. »",
  "« Le bonheur n'a pas de prix. Mais il a une CB : celle de Nico. »",
];

export const REFUSED_MSGS = [
  "Veuillez utiliser la CB de Nico.",
  "Tentative non conforme détectée 🚫",
  "Charlotte ne paie pas. Charlotte inspire.",
  "Erreur 402 : Mauvaise CB, Princess.",
  "Le service luxe et caprices décline poliment.",
];

export const CHART_QUOTES = [
  "« Nico est fier de ton sens du style. »",
  "« Charlotte valide chaque achat. »",
  "« Le luxe te va bien, Princess. »",
  "« Continue, Nico adore ça. »",
];

export const CATEGORIES = [
  {
    key: "Restau",
    icon: "🍽️",
    label: "Restau : niveau critique",
    color: "#FF8C42",
  },
  {
    key: "Vêtements",
    icon: "🛍️",
    label: "Vêtements : essentiel vital",
    color: "#FF007F",
  },
  {
    key: "Ongles",
    icon: "💅",
    label: "Ongles : priorité nationale",
    color: "#C7005F",
  },
  {
    key: "Voyages",
    icon: "✈️",
    label: "Voyages : projet permanent",
    color: "#9B59B6",
  },
  {
    key: "Cadeau surprise",
    icon: "🎁",
    label: "Cadeaux : jamais assez",
    color: "#FF4DA6",
  },
  {
    key: "Autre",
    icon: "✨",
    label: "Autres treats : indispensable",
    color: "#FFB7CE",
  },
];

export const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function formatEuro(n) {
  return (
    n.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  );
}

export function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  const isYest = d.toDateString() === yest.toDateString();
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  if (sameDay) return `Aujourd'hui, ${hh}:${mm}`;
  if (isYest) return `Hier, ${hh}:${mm}`;
  return (
    d.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }) + `, ${hh}:${mm}`
  );
}
