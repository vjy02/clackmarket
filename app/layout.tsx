import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
  ),
  title: "ClackMarket - r/mechmarket Alernative and Keyboard Marketplace",
  description:
    "ClackMarket is the r/mechmarket alternative — a community-powered marketplace to buy and sell mechanical keyboards, keycaps, artisan keycaps, switches, and custom keyboard gear. List items for free and explore the best destination for keyboard enthusiasts.",
  keywords: [
    "clackmarket",
    "keyboard",
    "marketplace",
    "mechanical keyboard",
    "mechanical keyboard marketplace",
    "gaming keyboard",
    "keycap",
    "mechmarket",
    "reddit",
    "mechmarket reddit",
    "mechmarket",
    "keyboard marketplace",
    "keychron second hand",
  ],
  manifest: "/manifest.webmanifest",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased bg-slate-50`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster richColors />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
