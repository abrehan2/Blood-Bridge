// IMPORTS -
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "./providers/AuthProvider";
import ToasterProvider from "./providers/ToasterProvider";
import "./globals.css";
import '@/globals/fonts.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blood Bridge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
