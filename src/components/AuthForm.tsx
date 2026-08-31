"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

// Connexion Google : n'apparaît que si le provider est activé côté Supabase
// (on pose alors NEXT_PUBLIC_GOOGLE_AUTH="true" sur Vercel). Lu au build.
const GOOGLE_AUTH = process.env.NEXT_PUBLIC_GOOGLE_AUTH === "true";

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
  const oauthFailed = useSearchParams().get("error") === "oauth";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  // Compte créé mais l'adhésion au foyer a échoué (code invalide/expiré).
  const [joinFailed, setJoinFailed] = useState<string | null>(null);
  // Compte créé mais e-mail à confirmer (« Confirm email » activé côté Supabase).
  const [confirmSent, setConfirmSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setJoinFailed(null);
    setConfirmSent(false);
    setPending(true);
    const supabase = createSupabaseBrowserClient();
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(next);
        router.refresh();
      } else if (mode === "signup") {
        // Après confirmation d'e-mail, Supabase renvoie sur cette URL (déjà
        // connecté) : la page d'invitation propose alors de rejoindre le foyer,
        // sinon on démarre l'onboarding.
        const emailRedirectTo = invite
          ? `${window.location.origin}/rejoindre?code=${encodeURIComponent(invite)}`
          : `${window.location.origin}/onboarding`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo },
        });
        if (error) throw error;
        if (!data.session) {
          // « Confirm email » activé : aucun accès tant que l'e-mail n'est pas
          // validé. On informe au lieu de rediriger (sinon rebond vers /login).
          setConfirmSent(true);
          setPending(false);
          return;
        }
        // Session immédiate (« Confirm email » désactivé) : flux direct.
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

  async function google() {
    setError(null);
    setPending(true);
    const supabase = createSupabaseBrowserClient();
    // Après OAuth, on repasse par /auth/callback qui route (onboarding / app /
    // invitation). On propage l'invitation ou la destination initiale.
    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (invite) redirectTo.searchParams.set("next", `/rejoindre?code=${invite}`);
    else if (next && next !== "/calendrier") redirectTo.searchParams.set("next", next);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo.toString() },
    });
    if (error) {
      setError(translateError(error));
      setPending(false);
    }
    // En cas de succès, le navigateur est redirigé vers Google : rien à faire.
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
        {oauthFailed && (
          <p className="mb-4 rounded-lg border border-brick/30 bg-brick/10 px-3 py-2 text-sm text-brick">
            La connexion Google a échoué. Réessaie, ou utilise ton e-mail et ton mot de passe.
          </p>
        )}
        {confirmSent ? (
          <div className="space-y-2 text-sm">
            <p className="text-ink">
              📧 <strong>Compte créé !</strong> Un e-mail de confirmation vient
              d’être envoyé à <strong>{email}</strong>.
            </p>
            <p className="text-ink-soft">
              Clique sur le lien pour activer ton compte
              {invite ? " et rejoindre le foyer" : ""}. Pense à vérifier tes spams.
            </p>
          </div>
        ) : joinFailed ? (
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
            {GOOGLE_AUTH && mode !== "reset" && (
              <>
                <button
                  type="button"
                  onClick={google}
                  disabled={pending}
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-parchment-deep disabled:opacity-60"
                >
                  <GoogleIcon />
                  Continuer avec Google
                </button>
                <div className="flex items-center gap-3 text-xs text-ink-soft">
                  <span className="h-px flex-1 bg-line" />
                  ou
                  <span className="h-px flex-1 bg-line" />
                </div>
              </>
            )}
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
