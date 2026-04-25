import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "PortfolioStress — Institutional Portfolio Risk Analysis",
  description: "Upload any portfolio. Stress test against 2008 GFC, COVID, and custom scenarios. Get factor analysis, Monte Carlo simulation, and AI-powered insights in under 60 seconds.",
  openGraph: {
    title: "PortfolioStress — Institutional Portfolio Risk Analysis",
    description: "Professional stress testing for wealth managers and RIAs.",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#191c1f]" style={{ fontFamily: 'var(--font-outfit), var(--font-geist-sans), sans-serif' }}>{children}</body>
    </html>
  );
}
