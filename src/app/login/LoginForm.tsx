"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { Card } from "@/components/ui";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <Card className="p-6">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-ink"
          >
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-lg border border-line bg-parchment px-3 py-2 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>
        {state?.error && (
          <p className="text-sm text-brick">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-ink px-4 py-2 font-medium text-parchment transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Connexion…" : "Entrer"}
        </button>
      </form>
    </Card>
  );
}
