import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayan — Creative Developer",
  description: "I build thoughtful digital experiences, experiment with AI, and turn ideas into real things. Based in India.",
  applicationName: "Ayan Portfolio",
  openGraph: {
    title: "Ayan — Creative Developer",
    description: "Creative developer building what's next. Web, AI, and robotics.",
    type: "website"
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
