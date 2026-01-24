import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NAGGA – North American Gujarati Golf Association",
  description: "Membership, events, and community for the North American Gujarati Golf Association.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen antialiased ${outfit.className}`} suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
