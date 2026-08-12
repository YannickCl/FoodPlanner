import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Food Planner",
    short_name: "Food Planner",
    description: "Repas de la famille : recettes, calendrier et liste de courses.",
    start_url: "/calendrier",
    display: "standalone",
    background_color: "#f3efe4",
    theme_color: "#c9a227",
    lang: "fr",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
