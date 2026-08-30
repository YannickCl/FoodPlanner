"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { joinHousehold } from "@/app/actions/household";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";

type Mode = "login" | "signup" | "reset";

const COPY: Record<Mode, { title: string; cta: string }> = {
  login: { title: "Connexion", cta: "Se connecter" },
  signup: { title: "Créer un compte", cta: "Créer mon compte" },
  reset: { title: "Mot de passe oublié", cta: "Recevoir le lien" },
};

export function AuthForm({
  mode,
  next = "/calendrier",
  invite,
}: {
  mode: Mode;
  next?: string;
  invite?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  // Compte créé mais l'adhésion au foyer a échoué (code invalide/expiré).
  const [joinFailed, setJoinFailed] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setJoinFailed(null);
    setPending(true);
    const supabase = createSupabaseBrowserClient();
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(next);
        router.refresh();
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (invite) {
          const res = await joinHousehold(invite);
          if (!res.ok) {
            // Le compte est créé, mais le lien d'invitation n'est pas valide :
            // on informe et on oriente vers la configuration d'un foyer.
            setJoinFailed(res.error ?? "Ce lien d’invitation est invalide ou expiré.");
            setPending(false);
            return;
          }
          router.replace("/calendrier");
        } else {
          router.replace("/onboarding");
        }
        router.refresh();
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset/update`,
        });
        if (error) throw error;
        setSent(true);
      }
    } catch (err) {
      setError(translateError(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <Image
          src="/logo.png"
          alt={APP_NAME}
          width={220}
          height={220}
          priority
          className="mx-auto mb-1 h-44 w-44 object-contain"
        />
        <p className="text-sm text-ink-soft">{COPY[mode].title}</p>
      </div>

      <Card className="p-6">
        {joinFailed ? (
          <div className="space-y-3 text-sm">
            <p className="text-ink">✅ Ton compte a bien été créé.</p>
            <p className="text-brick">{joinFailed}</p>
            <p className="text-ink-soft">
              Aucun souci : tu peux configurer ton propre foyer, ou redemander un
              lien d’invitation à la personne qui t’a invité·e.
            </p>
            <button
              onClick={() => {
                router.replace("/onboarding");
                router.refresh();
              }}
              className="w-full rounded-lg bg-ink px-4 py-2 font-medium text-parchment transition-opacity hover:opacity-90"
            >
              Configurer mon foyer
            </button>
          </div>
        ) : sent ? (
          <p className="text-sm text-ink">
            📧 Si un compte existe pour <strong>{email}</strong>, un lien de
            réinitialisation vient d’être envoyé. Pense à vérifier tes spams.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
            </div>

            {mode !== "reset" && (
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
              </div>
            )}

            {error && <p className="text-sm text-brick">{error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-ink px-4 py-2 font-medium text-parchment transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "…" : COPY[mode].cta}
            </button>
          </form>
        )}
      </Card>

      <div className="mt-4 space-y-1 text-center text-sm text-ink-soft">
        {mode === "login" && (
          <>
            <p>
              Pas encore de compte ?{" "}
              <Link href="/signup" className="font-medium text-ink underline">
                Créer un compte
              </Link>
            </p>
            <p>
              <Link href="/reset" className="underline hover:text-ink">
                Mot de passe oublié ?
              </Link>
            </p>
          </>
        )}
        {mode === "signup" && (
          <p>
            Déjà un compte ?{" "}
            <Link href="/login" className="font-medium text-ink underline">
              Se connecter
            </Link>
          </p>
        )}
        {mode === "reset" && (
          <p>
            <Link href="/login" className="underline hover:text-ink">
              ← Retour à la connexion
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

function translateError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/Invalid login credentials/i.test(msg)) return "E-mail ou mot de passe incorrect.";
  if (/already registered/i.test(msg)) return "Un compte existe déjà avec cet e-mail.";
  if (/Password should be at least/i.test(msg))
    return "Le mot de passe doit faire au moins 6 caractères.";
  if (/rate limit|too many/i.test(msg)) return "Trop de tentatives, réessaie dans un instant.";
  return msg;
}
