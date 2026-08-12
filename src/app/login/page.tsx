import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-3xl shadow-sm">
          🍽️
        </div>
        <p className="eyebrow mb-1">Repas de la famille</p>
        <h1 className="font-display text-5xl text-ink">Food Planner</h1>
        <p className="mt-2 text-sm text-ink-soft">Accès réservé à la famille</p>
      </div>
      <LoginForm next={next ?? "/calendrier"} />
    </div>
  );
}
