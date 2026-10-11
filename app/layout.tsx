import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

// Self-hosted typography: an editorial serif for display, a humanist sans for
// reading, and a mono for metadata. No remote font requests, no layout shift.
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource/dm-mono/latin-400.css";
import "@fontsource/dm-mono/latin-500.css";

import "./globals.css";

const siteUrl = "https://ayan-portfolio-lab.vercel.app";
const description =
  "Ayan is a student developer from India building websites, AI tools, and robotics experiments. Creative developer portfolio — selected work and creative technology.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ayan — Creative Developer",
  description,
  applicationName: "Ayan Portfolio",
  authors: [{ name: "Ayan", url: "https://github.com/aart9910-source" }],
  keywords: [
    "Ayan",
    "creative developer",
    "student developer India",
    "web development",
    "AI applications",
    "robotics",
    "Next.js portfolio",
    "Three.js"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Ayan — Creative Developer",
    title: "Ayan — Creative Developer",
    description:
      "Creative developer building what's next. Web experiences, AI applications, and robotics experiments from India."
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayan — Creative Developer",
    description: "Creative developer building what's next."
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#080807",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
