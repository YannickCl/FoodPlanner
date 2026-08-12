"use client";

import { useState, useTransition } from "react";

export function DeleteRecipeButton({
  deleteAction,
}: {
  deleteAction: () => Promise<unknown>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="rounded-full border border-brick/50 px-4 py-2 text-sm font-medium text-brick transition-colors hover:bg-brick hover:text-parchment"
      >
        Supprimer
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-ink-soft">Confirmer ?</span>
      <button
        disabled={pending}
        onClick={() => startTransition(() => void deleteAction())}
        className="rounded-full bg-brick px-3 py-2 text-sm font-medium text-parchment disabled:opacity-60"
      >
        {pending ? "…" : "Oui, supprimer"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="rounded-full border border-line px-3 py-2 text-sm text-ink-soft hover:text-ink"
      >
        Annuler
      </button>
    </div>
  );
}
