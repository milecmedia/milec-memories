import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ines & Silvijo | MILEC MEDIA",
  description: "Podijelite uspomene s vjenčanja",
    icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}