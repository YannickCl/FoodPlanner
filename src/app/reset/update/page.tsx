"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => {
        router.replace("/calendrier");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl text-ink">{APP_NAME}</h1>
        <p className="mt-2 text-sm text-ink-soft">Nouveau mot de passe</p>
      </div>
      <Card className="p-6">
        {done ? (
          <p className="text-sm text-green">✓ Mot de passe mis à jour. Redirection…</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
                Nouveau mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
            </div>
            {error && <p className="text-sm text-brick">{error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-ink px-4 py-2 font-medium text-parchment transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "…" : "Enregistrer"}
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
