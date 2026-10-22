import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PinchZoomGuard } from "@/components/shell/PinchZoomGuard";
import { Navbar } from "@/components/shell/Navbar";
import { Footer } from "@/components/shell/Footer";
import { ALL_138_BLOCKS } from "@/lib/blocksCatalog";

// Inline data-URI SVG favicon with its own @media (prefers-color-scheme) rule
// so it follows the BROWSER tab bar theme rather than page state.
const INLINE_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><style>.fg{stroke:#17181a}.ring{stroke:#0d99ff}@media (prefers-color-scheme:dark){.fg{stroke:#f4f3f1}.ring{stroke:#38adff}}</style><circle cx="16" cy="16" r="13.5" class="fg" stroke-opacity=".28" stroke-width="1.6"/><ellipse cx="16" cy="16" rx="13.5" ry="6.2" transform="rotate(-24 16 16)" class="ring" stroke-width="1.8"/><path d="M12.2 20L16 12.2L19.8 20M16 12.2C13.8 8 9.4 8.5 8.8 12.2M16 12.2C18.2 8 22.6 8.5 23.2 12.2" class="fg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="26.8" cy="11" r="2.2" fill="#ff3b6b"/></svg>`;
const INLINE_FAVICON_DATA_URI = `data:image/svg+xml,${encodeURIComponent(INLINE_FAVICON_SVG)}`;

// Layer 1 of Bencho's 3-layer pinch-zoom defense
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f6" },
    { media: "(prefers-color-scheme: dark)", color: "#131417" },
  ],
};

// Brand-first <title>, exact 1200x630 OG cover, and intentionally NO og:url
export const metadata: Metadata = {
  title: "Bencho — Live Interactive UI Blocks & Sounds",
  description:
    "Explore and interact with a selection of live UI Blocks and Sounds. Tweak physics, copy source, or pull via MCP straight into your projects. Everything is live, not mocked.",
  icons: {
    icon: INLINE_FAVICON_DATA_URI,
    shortcut: INLINE_FAVICON_DATA_URI,
  },
  openGraph: {
    title: "Bencho — Live Interactive UI Blocks & Sounds",
    description:
      "A library of live, interactive UI blocks and tactile sounds you can explore, tweak, and take straight into your projects.",
    images: [
      {
        url: "/share-cover-ring.png",
        width: 1200,
        height: 630,
        alt: "Bencho orbital ring emblem",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bencho — Live Interactive UI Blocks & Sounds",
    description: "Everything is live, not mocked. Run by Lorenzo Cabra.",
    images: ["/share-cover-ring.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bencho Interactive UI Blocks",
    description:
      "Live interactive React UI blocks and procedural UI sound effects by Lorenzo Cabra.",
    numberOfItems: ALL_138_BLOCKS.length,
    itemListElement: ALL_138_BLOCKS.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.title,
      url: `/blocks/${b.id}`,
    })),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <PinchZoomGuard />

        {/* <noscript> SEO shell rendering h1 + all 138 block links when JS is disabled */}
        <noscript>
          <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
            <h1>Bencho — Live Interactive UI Blocks &amp; Sounds</h1>
            <p>
              Explore and interact with 138 live UI blocks and tactile sounds. Run by Lorenzo
              Cabra.
            </p>
            <ul>
              {ALL_138_BLOCKS.map((b) => (
                <li key={b.id}>
                  <a href={`/blocks/${b.id}`}>
                    {b.title} ({b.kind}) — {b.tagline}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </noscript>

        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
