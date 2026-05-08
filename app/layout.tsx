import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ines & Silvijo | MILEC MEDIA",
  description: "Podijelite uspomene s vjenčanja",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
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