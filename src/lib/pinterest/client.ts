import "server-only";

// Client minimal de l'API Pinterest v5.
// Auth : un refresh token longue durée (PINTEREST_REFRESH_TOKEN) est échangé
// contre un access token court à chaque exécution — rien à stocker en base.

const BASE = "https://api.pinterest.com/v5";

export function pinterestConfigured(): boolean {
  return Boolean(
    process.env.PINTEREST_APP_ID &&
      process.env.PINTEREST_APP_SECRET &&
      process.env.PINTEREST_REFRESH_TOKEN,
  );
}

function basicAuthHeader(): string {
  const id = process.env.PINTEREST_APP_ID ?? "";
  const secret = process.env.PINTEREST_APP_SECRET ?? "";
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

async function readError(res: Response): Promise<string> {
  try {
    const body = await res.text();
    return `${res.status} ${body.slice(0, 300)}`;
  } catch {
    return `${res.status}`;
  }
}

/** Échange le refresh token (ou un code d'autorisation) contre un access token. */
export async function exchangeToken(
  params: Record<string, string>,
): Promise<{ access_token: string; refresh_token?: string; expires_in?: number }> {
  const res = await fetch(`${BASE}/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params).toString(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Pinterest oauth/token: ${await readError(res)}`);
  return res.json();
}

/** Access token à partir du refresh token stocké en variable d'environnement. */
export async function getAccessToken(): Promise<string> {
  const refresh = process.env.PINTEREST_REFRESH_TOKEN;
  if (!refresh) throw new Error("PINTEREST_REFRESH_TOKEN manquant");
  const data = await exchangeToken({
    grant_type: "refresh_token",
    refresh_token: refresh,
  });
  return data.access_token;
}

async function apiGet<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Pinterest GET ${path}: ${await readError(res)}`);
  return res.json();
}

type Paged<T> = { items: T[]; bookmark?: string | null };

/** Map { nom de tableau en minuscules -> id }. */
export async function listBoards(token: string): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  let bookmark: string | undefined;
  do {
    const q = new URLSearchParams({ page_size: "100" });
    if (bookmark) q.set("bookmark", bookmark);
    const page = await apiGet<Paged<{ id: string; name: string }>>(
      token,
      `/boards?${q.toString()}`,
    );
    for (const b of page.items) map.set(b.name.trim().toLowerCase(), b.id);
    bookmark = page.bookmark ?? undefined;
  } while (bookmark);
  return map;
}

/** Ensemble des titres d'épingles déjà publiées (minuscules) — pour dédupliquer. */
export async function listExistingPinTitles(token: string): Promise<Set<string>> {
  const titles = new Set<string>();
  let bookmark: string | undefined;
  let guard = 0;
  do {
    const q = new URLSearchParams({ page_size: "100" });
    if (bookmark) q.set("bookmark", bookmark);
    const page = await apiGet<Paged<{ title?: string }>>(
      token,
      `/pins?${q.toString()}`,
    );
    for (const p of page.items) {
      if (p.title) titles.add(p.title.trim().toLowerCase());
    }
    bookmark = page.bookmark ?? undefined;
  } while (bookmark && ++guard < 20);
  return titles;
}

/** Crée une épingle image (Pinterest télécharge l'image depuis imageUrl). */
export async function createPin(
  token: string,
  pin: {
    boardId: string;
    title: string;
    description: string;
    link: string;
    imageUrl: string;
  },
): Promise<string> {
  const res = await fetch(`${BASE}/pins`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      board_id: pin.boardId,
      title: pin.title,
      description: pin.description,
      link: pin.link,
      media_source: { source_type: "image_url", url: pin.imageUrl },
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Pinterest POST /pins: ${await readError(res)}`);
  const data = (await res.json()) as { id: string };
  return data.id;
}
