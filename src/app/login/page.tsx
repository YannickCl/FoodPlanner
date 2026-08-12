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
        <h1 className="font-display text-3xl text-ink">Le Garde-manger</h1>
        <p className="mt-1 text-sm text-ink-soft">Accès réservé à la famille</p>
      </div>
      <LoginForm next={next ?? "/calendrier"} />
    </div>
  );
}
