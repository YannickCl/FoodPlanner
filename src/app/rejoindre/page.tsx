import Link from "next/link";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";
import { JoinConfirm } from "./JoinConfirm";

export const dynamic = "force-dynamic";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-3xl shadow-sm">
          🍽️
        </div>
        <h1 className="font-display text-4xl text-ink">{APP_NAME}</h1>
      </div>
      <Card className="p-6">{children}</Card>
    </div>
  );
}

export default async function RejoindrePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const clean = (code ?? "").trim().toLowerCase();
  const household = clean
    ? await prisma.household.findUnique({
        where: { inviteCode: clean },
        select: { name: true },
      })
    : null;

  if (!household) {
    return (
      <Shell>
        <p className="text-center text-sm text-ink">
          Cette invitation est invalide ou a expiré. Demande un nouveau lien à la
          personne qui t’a invité·e.
        </p>
      </Shell>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Shell>
        <p className="mb-4 text-center text-sm text-ink">
          Tu es invité·e à rejoindre le foyer <strong>{household.name}</strong>.
        </p>
        <Link
          href={`/signup?invite=${clean}`}
          className="block w-full rounded-lg bg-ink px-4 py-2.5 text-center font-medium text-parchment hover:opacity-90"
        >
          Créer un compte et rejoindre
        </Link>
        <p className="mt-3 text-center text-sm text-ink-soft">
          Déjà un compte ?{" "}
          <Link
            href={`/login?next=${encodeURIComponent(`/rejoindre?code=${clean}`)}`}
            className="font-medium text-ink underline"
          >
            Se connecter
          </Link>
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <JoinConfirm code={clean} householdName={household.name} />
    </Shell>
  );
}
