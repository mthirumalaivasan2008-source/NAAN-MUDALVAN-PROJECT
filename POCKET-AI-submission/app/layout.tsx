import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POCKET.AI — Smart Budget Assistant",
  description: "AI-powered personal finance dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
