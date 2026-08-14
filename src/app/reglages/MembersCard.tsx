"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui";
import {
  getInviteCode,
  regenerateInviteCode,
  removeMember,
  leaveHousehold,
} from "@/app/actions/household";

interface Member {
  id: string;
  email: string;
  role: string;
}

export function MembersCard({
  householdName,
  initialCode,
  members,
  currentUserId,
}: {
  householdName: string;
  initialCode: string | null;
  members: Member[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(initialCode);
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = members.find((m) => m.id === currentUserId)?.role === "owner";

  function remove(userId: string) {
    setError(null);
    startTransition(async () => {
      const r = await removeMember(userId);
      if (r.ok) {
        setConfirmId(null);
        router.refresh();
      } else setError(r.error ?? "Erreur");
    });
  }
  function leave() {
    setError(null);
    startTransition(async () => {
      const r = await leaveHousehold();
      if (r.ok) {
        router.replace("/calendrier");
        router.refresh();
      } else setError(r.error ?? "Erreur");
    });
  }

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

      <ul className="mb-3 space-y-1.5">
        {members.map((m) => {
          const canRemove = isOwner && m.id !== currentUserId && m.role !== "owner";
          return (
            <li
              key={m.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-line bg-parchment px-3 py-2 text-sm"
            >
              <span className="truncate text-ink">
                {m.email}
                {m.id === currentUserId && <span className="text-ink-soft"> (toi)</span>}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-medium text-ink">
                  {m.role === "owner" ? "Propriétaire" : "Membre"}
                </span>
                {canRemove &&
                  (confirmId === m.id ? (
                    <span className="flex items-center gap-1">
                      <button
                        onClick={() => remove(m.id)}
                        disabled={pending}
                        className="rounded-full bg-brick px-2.5 py-0.5 text-[11px] font-medium text-parchment hover:opacity-90 disabled:opacity-60"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-[11px] text-ink-soft hover:text-ink"
                      >
                        Annuler
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmId(m.id)}
                      className="text-[11px] text-ink-soft underline hover:text-brick"
                    >
                      Retirer
                    </button>
                  ))}
              </div>
            </li>
          );
        })}
      </ul>

      {members.length > 1 && (
        <div className="mb-4">
          {confirmLeave ? (
            <span className="flex items-center gap-2 text-xs">
              <span className="text-ink-soft">Quitter ce foyer et repartir à zéro ?</span>
              <button
                onClick={leave}
                disabled={pending}
                className="rounded-full bg-brick px-3 py-1 font-medium text-parchment hover:opacity-90 disabled:opacity-60"
              >
                Oui, quitter
              </button>
              <button onClick={() => setConfirmLeave(false)} className="text-ink-soft hover:text-ink">
                Annuler
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirmLeave(true)}
              className="text-xs text-ink-soft underline hover:text-brick"
            >
              Quitter le foyer
            </button>
          )}
        </div>
      )}

      {error && <p className="mb-3 text-sm text-brick">{error}</p>}

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
