import "~/styles/globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import NextTopLoader from "nextjs-toploader";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { type Viewport } from "next";

export const metadata: Metadata = {
  title: "NFC Portal",
  description: "Custom pages for your NFC business card",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  authors: [
    {
      name: "Alvaro",
      url: "https://github.com/statusunknown418",
    },
  ],
  metadataBase: new URL("https://nfc-portal.vercel.app"),
  openGraph: {
    images: "/opengraph-image.png",
    type: "website",
    url: "https://nfc-portal.vercel.app/opengraph-image.png",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} md:text-sm`}>
      <body className="h-screen">
        <NextTopLoader showSpinner={false} color="#4338ca" height={5} />

        <TRPCReactProvider>{children}</TRPCReactProvider>

        <Toaster />

    <SpeedInsights />
      </body>
    </html>
  );
}
