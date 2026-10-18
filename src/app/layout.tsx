import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoProvider } from "@/lib/store/demo-context";

import { QueryProvider } from "@/components/providers/query-provider";

export const metadata: Metadata = {
  title: "Smart Entry — Residential Property & Security Management",
  description:
    "Centralized residential property operations, visitor management, access control, and service management portal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.cdnfonts.com/css/google-sans"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-zinc-50 text-zinc-900 selection:bg-zinc-800 selection:text-white">
        <QueryProvider>
          <DemoProvider>
            <TooltipProvider>
              {children}
              <Toaster position="top-right" richColors={false} />
            </TooltipProvider>
          </DemoProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

