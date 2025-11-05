import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Orders Management System | Propaga Challenge",
    template: "%s | Orders Management",
  },
  description:
    "Efficient order management dashboard for tracking new, paid, and cancelled orders with real-time statistics and comprehensive order details.",
  keywords: [
    "orders",
    "management",
    "dashboard",
    "e-commerce",
    "order tracking",
    "business management",
  ],
  authors: [{ name: "Erick Peña" }],
  creator: "Erick Peña",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Orders Management System",
    description:
      "Efficient order management dashboard for tracking orders with real-time statistics",
    siteName: "Orders Management",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Orders Management Dashboard",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Orders Management System",
    description: "Efficient order management dashboard for tracking orders",
    images: ["/images/twitter-image.jpg"],
    creator: "@yourhandle",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{ overflowX: "hidden", width: "100%", maxWidth: "100vw" }}
    >
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: 0,
          overflowX: "hidden",
          width: "100%",
          maxWidth: "100vw",
        }}
      >
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
