import type { Metadata } from "next";
import { Anton, Inter, Caveat } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSI VITC",
  description: "Computer Society of India - VIT Chennai Student Chapter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} ${caveat.variable}`}>
      <body style={{ margin: 0, overflow: "hidden", backgroundColor: "#0a0a0a" }}>{children}</body>
    </html>
  );
}
