import type { Metadata } from "next";
import { Geist, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ConsentAnalytics, { AnalyticsSettingsButton } from "../components/ConsentAnalytics";
import Link from "next/link";
import Nav from "../components/Nav";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const display = Sora({ variable: "--font-display", subsets: ["latin"], weight: ["500","600","700"] });

export const metadata: Metadata = {
  title: "Scam Shield",
  description: "Paste a suspicious message or upload a call recording. Get a plain-language verdict in Hindi or English, with quoted evidence and what to do next.",
  authors: [{ name: "Divyansh Srivastava" }],
  creator: "Divyansh Srivastava",
  openGraph: { title: "Scam Shield", type: "website", siteName: "Scam Shield" },
  twitter: { card: "summary", title: "Scam Shield" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-zinc-100">
        <a href="#main" className="skip-link">Skip to content</a>
        <Nav />
        <div id="main" tabIndex={-1} className="flex-1 outline-none">{children}</div>
        <footer className="mx-auto w-full max-w-6xl px-4 py-8 text-xs text-zinc-400">
          © 2026 Divyansh Srivastava. All rights reserved. Developed by Divyansh Srivastava. Not legal advice. A probability, not proof.{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-zinc-300">Privacy</Link>{" · "}<AnalyticsSettingsButton />
        </footer>
        <Analytics />
        <ConsentAnalytics app="Scam Shield" />
      </body>
    </html>
  );
}
