import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import GlobalBackground from "@/components/GlobalBackground";

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
      <body className="min-h-full flex flex-col bg-[#0A1628]" style={{ fontFamily: 'var(--font-outfit), var(--font-geist-sans), sans-serif' }}>
        <GlobalBackground />
        <div className="relative z-10 flex flex-col min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
