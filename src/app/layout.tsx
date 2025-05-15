import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solana AppKit",
  description:
    "Build Vibe Apps using AI, powered by Solana App Kit | Sendcoin Ecosystem",
  keywords: ["solana", "hackathon", "ai", "SendAI", "Solana AppKit"],
  authors: [{ name: "Solana AppKit", url: "https://www.solanaappkit.com" }],
  openGraph: {
    title: "Solana AppKit",
    description:
      "Build Vibe Apps using AI, powered by Solana App Kit | Sendcoin Ecosystem",
    url: "https://www.solanaappkit.com",
    siteName: "Solana AppKit",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Solana AppKit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana AppKit",
    description:
      "Build Vibe Apps using AI, powered by Solana App Kit | Sendcoin Ecosystem",
    images: ["/og.png"],
  },
  metadataBase: new URL("https://www.solanaappkit.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
