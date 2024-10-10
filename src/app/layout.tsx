import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import { type Metadata, type Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "ConCard",
  description: "Custom pages for your NFC business card",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  authors: [
    {
      name: "Alvaro",
      url: "https://github.com/statusunknown418",
    },
  ],
  metadataBase: new URL("https://concard.app"),
  openGraph: {
    images: "/opengraph-image.png",
    type: "website",
    url: "https://concard.app/opengraph-image.png",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
  viewportFit: "cover",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider
      appearance={{
        userProfile: {
          elements: {
            profileSectionPrimaryButton__username: "hidden",
          },
        },
        elements: {
          userButtonTrigger: "aspect-square",
          userButtonAvatarBox: "w-10 h-10",
          profileSectionPrimaryButton__username: "hidden",
          userPreviewSecondaryIdentifier: "font-semibold tracking-wide",
        },
      }}
    >
      <html lang={locale} className={`${GeistSans.variable} md:text-sm`}>
        <NextIntlClientProvider messages={messages}>
          <TRPCReactProvider>
            <body className="h-screen">
              <NextTopLoader showSpinner={false} color="#4338ca" height={5} />

              {children}

              <Toaster />

              <SpeedInsights />
            </body>
          </TRPCReactProvider>
        </NextIntlClientProvider>
      </html>
    </ClerkProvider>
  );
}
