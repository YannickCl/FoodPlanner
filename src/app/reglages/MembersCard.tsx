"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui";
import { getInviteCode, regenerateInviteCode } from "@/app/actions/household";

interface Member {
  id: string;
  email: string;
  role: string;
}

export function MembersCard({
  householdName,
  initialCode,
  members,
}: {
  householdName: string;
  initialCode: string | null;
  members: Member[];
}) {
  const [code, setCode] = useState<string | null>(initialCode);
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const link = code
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/rejoindre?code=${code}`
    : "";

  function generate() {
    startTransition(async () => {
      const r = await getInviteCode();
      setCode(r.code);
    });
  }
  function regenerate() {
    startTransition(async () => {
      const r = await regenerateInviteCode();
      setCode(r.code);
      setCopied(false);
    });
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponible */
    }
  }

  return (
    <Card className="p-5">
      <label className="mb-1 block text-sm font-medium text-ink">
        👨‍👩‍👧 Foyer &amp; membres
      </label>
      <p className="mb-3 text-xs text-ink-soft">
        Les membres de « {householdName} » partagent les mêmes recettes, planning et
        liste de courses.
      </p>

      <ul className="mb-4 space-y-1.5">
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between rounded-lg border border-line bg-parchment px-3 py-2 text-sm"
          >
            <span className="truncate text-ink">{m.email}</span>
            <span className="ml-2 shrink-0 rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-medium text-ink">
              {m.role === "owner" ? "Propriétaire" : "Membre"}
            </span>
          </li>
        ))}
      </ul>

      {code ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-ink">Lien d’invitation</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 truncate rounded-lg border border-line bg-parchment px-3 py-2 text-xs text-ink-soft outline-none"
            />
            <button
              onClick={copy}
              className="shrink-0 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-parchment hover:opacity-90"
            >
              {copied ? "Copié ✓" : "Copier"}
            </button>
          </div>
          <p className="text-xs text-ink-soft">
            Partage ce lien à un proche : il crée son compte et rejoint ton foyer.
          </p>
          <button
            onClick={regenerate}
            disabled={pending}
            className="text-xs text-ink-soft underline hover:text-ink disabled:opacity-60"
          >
            Régénérer le lien (invalide l’ancien)
          </button>
        </div>
      ) : (
        <button
          onClick={generate}
          disabled={pending}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "…" : "Inviter un membre"}
        </button>
      )}
    </Card>
  );
}
