import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} text-sm`}>
      <body className="h-full">
        <TRPCReactProvider>{children}</TRPCReactProvider>

        <Toaster />
      </body>
    </html>
  );
}
