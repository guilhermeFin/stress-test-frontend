import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vantage — Institutional Portfolio Risk Analysis",
  description: "Stress test. Build confidence. Institutional-grade portfolio risk analysis in 60 seconds. Built for wealth managers and RIAs.",
  openGraph: {
    title: "Vantage — Institutional Portfolio Risk Analysis",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0F1E]" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
        <Providers>
          <div className="relative z-10 flex flex-col min-h-full">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
