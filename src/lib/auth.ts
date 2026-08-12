// Auth minimale : un mot de passe partagé pour le foyer, matérialisé par un
// cookie signé (HMAC-SHA256). Compatible edge (middleware) ET node (actions).

export const SESSION_COOKIE = "gm_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 jours

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecodeToString(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  return atob(b64);
}

async function hmac(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return b64urlEncode(new Uint8Array(sig));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(secret: string): Promise<string> {
  const payloadObj = { exp: Date.now() + MAX_AGE_SECONDS * 1000 };
  const payload = b64urlEncode(
    new TextEncoder().encode(JSON.stringify(payloadObj)),
  );
  const sig = await hmac(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  secret: string,
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await hmac(secret, payload);
  if (!timingSafeEqual(sig, expected)) return false;
  try {
    const { exp } = JSON.parse(b64urlDecodeToString(payload)) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
