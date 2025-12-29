import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthButton } from "@/components/AuthButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pomodoro Timer - Focus",
  description: "An atmospheric lofi Pomodoro timer to help you focus and be productive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {/* Auth Button - Fixed in top-left corner */}
        <div className="fixed top-6 left-6 z-50">
          <AuthButton />
        </div>
        {children}
      </body>
    </html>
  );
}
