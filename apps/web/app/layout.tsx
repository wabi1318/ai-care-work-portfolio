import type React from "react";
import type { Metadata } from "next";
import "../../../packages/ui/src/styles/globals.css";
import { Toaster } from "../../../packages/ui/src/components/toaster";

export const metadata: Metadata = {
  title: "AI Care Work Portfolio",
  description: "AI Care Work Portfolio",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
