import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { getSettings } from "@/lib/queries";
import { buildThemeCss } from "@/lib/theme";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const APP_DESCRIPTION =
  "Organisez les repas de la semaine, la liste de courses et le batch cooking, sans prise de tête.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: APP_NAME,
    template: `%s — ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  // Privé par défaut : seul le groupe (marketing) réactive l'indexation,
  // et uniquement quand NEXT_PUBLIC_SEO_INDEX=true (voir src/lib/seo.ts).
  robots: { index: false, follow: false },
  manifest: "/manifest.webmanifest",
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#c9a227",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Sur les pages d'auth (non connecté), getSettings lève "Non authentifié" :
  // on retombe alors sur le thème par défaut.
  let themeCss = "";
  try {
    themeCss = buildThemeCss(await getSettings());
  } catch {
    themeCss = "";
  }
  return (
    <html lang="fr">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} paper-grain min-h-screen`}
      >
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
        <NavBar />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
