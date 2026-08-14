"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinHousehold } from "@/app/actions/household";

export function JoinConfirm({ code, householdName }: { code: string; householdName: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function join() {
    setPending(true);
    setError(null);
    const res = await joinHousehold(code);
    if (res.ok) {
      router.replace("/calendrier");
      router.refresh();
    } else {
      setError(res.error ?? "Erreur");
      setPending(false);
    }
  }

  return (
    <div className="text-center">
      <p className="mb-4 text-sm text-ink">
        Rejoindre le foyer <strong>{householdName}</strong> ? Tu partageras ses
        recettes, son planning et sa liste de courses.
      </p>
      {error && <p className="mb-3 text-sm text-brick">{error}</p>}
      <button
        onClick={join}
        disabled={pending}
        className="w-full rounded-lg bg-ink px-4 py-2.5 font-medium text-parchment hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "…" : `Rejoindre ${householdName}`}
      </button>
    </div>
  );
}
