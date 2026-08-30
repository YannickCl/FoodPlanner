import type { Metadata, Viewport } from "next";
import { Dancing_Script, Inter, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { ConsentBanner } from "@/components/ConsentBanner";
import { getSettings } from "@/lib/queries";
import { buildThemeCss } from "@/lib/theme";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";
import { GTM_ID } from "@/lib/analytics";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-script",
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
  themeColor: "#c1913f",
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
        className={`${dancingScript.variable} ${inter.variable} ${plexMono.variable} paper-grain min-h-screen`}
      >
        {/* Mesure d'audience (GTM/GA4) — chargée seulement si NEXT_PUBLIC_GTM_ID
            est défini, et Consent Mode v2 par défaut sur "denied" (aucun cookie
            avant accord). */}
        {GTM_ID && (
          <>
            <Script id="consent-default" strategy="beforeInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});try{if(localStorage.getItem('cm-consent')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`}
            </Script>
            <Script id="gtm-loader" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
          </>
        )}
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
        <NavBar />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
          {children}
        </main>
        {GTM_ID && <ConsentBanner />}
      </body>
    </html>
  );
}
