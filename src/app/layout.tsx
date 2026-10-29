import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Nav from "../components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scam Shield",
  description: "Paste a suspicious message or upload a call recording. Get a plain-language verdict in Hindi or English, with quoted evidence and what to do next.",
  authors: [{ name: "Divyansh Srivastava" }],
  creator: "Divyansh Srivastava",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col text-zinc-100">
        <Nav />
        {children}
        <footer className="mx-auto w-full max-w-5xl px-4 py-8 text-xs text-zinc-500">
          © 2026 Divyansh Srivastava. All rights reserved. Developed by Divyansh Srivastava. Not legal advice. A probability, not proof.
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
