import { ImageResponse } from "next/og";

import type { Locale } from "@/i18n/routing";
import { getPageCopy } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Image({ params }: ImageProps) {
  const { locale } = await params;
  const copy = await getPageCopy("home", locale as Locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          backgroundColor: "#4a0e1a",
        }}
      >
        <span
          style={{
            fontSize: 26,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#8b6f47",
          }}
        >
          {copy.eyebrow ?? siteConfig.tagline}
        </span>
        <span
          style={{
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#edeae4",
          }}
        >
          {siteConfig.name}
        </span>
        <span
          style={{
            fontSize: 30,
            maxWidth: 820,
            textAlign: "center",
            color: "rgba(237, 234, 228, 0.7)",
          }}
        >
          {copy.intro}
        </span>
      </div>
    ),
    { ...size },
  );
}
