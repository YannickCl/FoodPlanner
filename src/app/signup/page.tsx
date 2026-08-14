import { AuthForm } from "@/components/AuthForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;
  return <AuthForm mode="signup" invite={invite} />;
}
