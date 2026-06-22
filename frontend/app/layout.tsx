import PageTracker from "./components/PageTracker"
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BEI — Business Execution Intelligence",
  description: "Identify the highest-value root constraint limiting your business.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}
      <PageTracker /></body>
    </html>
  );
}
