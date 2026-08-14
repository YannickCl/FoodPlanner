import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Client Supabase côté serveur (composants serveur, actions, route handlers).
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Appelé depuis un composant serveur : le rafraîchissement des
            // cookies est géré par le proxy (middleware).
          }
        },
      },
    },
  );
}
