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
  metadataBase: new URL('https://www.solanaappkit.com'),
  title: "Solana AppKit",
  description: "Build Solana Vibe Apps for mobile in ~15 minutes and 1 line of command — powered by SendAI and Send Arcade.",
  openGraph: {
    title: 'Solana AppKit',
    description: 'Build Solana Vibe Apps for mobile in ~15 minutes and 1 line of command — powered by SendAI and Send Arcade.',
    images: [
      {
        url: '/OG_IMAGE.png',
        width: 1200,
        height: 630,
        alt: 'Solana AppKit Open Graph Image',
      },
    ],
    siteName: 'Solana AppKit',
    type: 'website',
    locale: 'en_US',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'mask-icon',
        url: '/Logo.svg',
        color: '#FFFFFF',
      },
    ],
  },
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
