import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "Ines & Silvijo | MILEC MEDIA",
  icons: {
    icon: "/favicon.ico?v=2000",
    shortcut: "/favicon.ico?v=2000",
    apple: "/favicon.ico?v=2000",
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