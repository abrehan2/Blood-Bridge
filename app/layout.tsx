// IMPORTS -
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "./providers/AuthProvider";
import "./globals.css";
import '@/globals/fonts.css';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

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
        <ToastContainer
          autoClose={2000}
          theme='light' />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
