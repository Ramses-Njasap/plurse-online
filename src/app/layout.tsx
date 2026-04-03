import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GridBackground from "../components/Background";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plurse",
  description: "Intelligent tools for business growth",
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
      {/* bg-[#FAFAF9] matches the warm-neutral base in GridBackground */}
      <body className="min-h-full flex flex-col bg-[#FAFAF9]">
        <GridBackground />
        <Navbar />
        {/* pt-[68px] offsets fixed navbar height */}
        <main className="relative z-10 flex-1 pt-[68px]">
          {children}
        </main>
      </body>
    </html>
  );
}