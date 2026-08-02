import type { Metadata } from "next";
import { Geist_Mono, Inter, Syne } from "next/font/google";

import { ProDocAssistant } from "@/components/assistant/ProDocAssistant";
import { AppBackground } from "@/components/layout/AppBackground";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PageFadeIn } from "@/components/shared/PageFadeIn";
import { ThemeBootstrapScript } from "@/components/theme/ThemeBootstrapScript";
import "./globals.css";
import { DEFAULT_THEME } from "@/lib/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ProDoc — Documentation Platform",
    template: "ProDoc | %s",
  },
  description:
    "Documentation intelligence platform — ProDoc, ProAssist, ProFeed, ProInsights, and ProAPI. Built by Linga Raj M, Documentation Platform Strategist.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${DEFAULT_THEME} ${inter.variable} ${syne.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeBootstrapScript />
        <AppBackground />
        <div className="app-shell">
          <PageFadeIn>{children}</PageFadeIn>
          <MobileBottomNav />
          <ProDocAssistant />
        </div>
      </body>
    </html>
  );
}
