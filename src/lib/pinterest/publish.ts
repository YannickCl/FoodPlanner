import "server-only";
import { SITE_URL } from "@/lib/seo";
import { PIN_MANIFEST } from "@/lib/pinterest/manifest";
import {
  createPin,
  getAccessToken,
  listBoards,
  listExistingPinTitles,
  pinterestConfigured,
} from "@/lib/pinterest/client";

export type PublishResult =
  | { ok: true; status: "skipped"; reason: string }
  | { ok: true; status: "done"; message: string; missingBoards?: string[] }
  | {
      ok: true;
      status: "published";
      slug: string;
      pinId: string;
      board: string;
      remaining: number;
    };

/**
 * Publie UNE épingle en attente (drip). Sans état en base : on considère comme
 * « déjà publiée » toute épingle dont le titre existe déjà sur le compte
 * Pinterest — impossible de créer un doublon. Idempotent et sûr à relancer.
 */
export async function runPinterestPublish(): Promise<PublishResult> {
  if (!pinterestConfigured()) {
    return { ok: true, status: "skipped", reason: "pinterest-not-configured" };
  }

  const token = await getAccessToken();
  const [boards, existing] = await Promise.all([
    listBoards(token),
    listExistingPinTitles(token),
  ]);

  const pending = PIN_MANIFEST.filter(
    (p) => !existing.has(p.pinTitle.trim().toLowerCase()),
  );

  const missingBoards: string[] = [];
  for (const pin of pending) {
    const boardId = boards.get(pin.board.trim().toLowerCase());
    if (!boardId) {
      // Tableau absent côté Pinterest : on le signale et on tente la suivante.
      if (!missingBoards.includes(pin.board)) missingBoards.push(pin.board);
      continue;
    }
    const pinId = await createPin(token, {
      boardId,
      title: pin.pinTitle,
      description: pin.description,
      link: `${SITE_URL}${pin.path}`,
      imageUrl: `${SITE_URL}/pins/${pin.slug}.png`,
    });
    return {
      ok: true,
      status: "published",
      slug: pin.slug,
      pinId,
      board: pin.board,
      remaining: pending.length - 1,
    };
  }

  return {
    ok: true,
    status: "done",
    message:
      missingBoards.length > 0
        ? "Aucune épingle publiable : tableaux introuvables."
        : "Toutes les épingles du manifeste sont déjà publiées.",
    ...(missingBoards.length > 0 ? { missingBoards } : {}),
  };
}
