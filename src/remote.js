// JSONBin.io sync layer
const BIN_ID = "69e9c53836566621a8e1a600";
const KEY = "$2a$10$E62FMvSqrHCh3z8PkHvJvOgYxrLXkQYOVER/4WuawHHWAMf1qBWWK";
const KEY_TYPE = "master";
const BASE = "https://api.jsonbin.io/v3/b";

export const isRemoteEnabled = Boolean(
  BIN_ID && KEY && !KEY.includes("REMPLACE"),
);

const headers = () => {
  const h = { "Content-Type": "application/json", "X-Bin-Meta": "false" };
  if (KEY_TYPE === "access") h["X-Access-Key"] = KEY;
  else h["X-Master-Key"] = KEY;
  return h;
};

async function safeFetch(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {}
    throw new Error(
      `JSONBin ${res.status} ${res.statusText} — ${body.slice(0, 200)}`,
    );
  }
  return res.json();
}

export async function fetchRemote() {
  if (!isRemoteEnabled) return null;
  return safeFetch(`${BASE}/${BIN_ID}/latest`, {
    headers: headers(),
    cache: "no-store",
  });
}

export async function pushRemote(state) {
  if (!isRemoteEnabled) return null;
  return safeFetch(`${BASE}/${BIN_ID}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(state),
  });
}
