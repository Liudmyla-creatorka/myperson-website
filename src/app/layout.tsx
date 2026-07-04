import type { Metadata } from "next";
import type { ReactNode } from "react";

import { siteConfig } from "@/lib/site-config";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
