import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";

import "./globals.css";

import Divider from "@/components/divider/Divider";
import BackToTop from "@/components/buttons/back-to-top/BackToTop";
import CookieConsentModal from "@/components/modals/cookie-consent/CookieConsentModal";
import Navbar from "@/components/navigation/navbar/Navbar";
import AnalyticsConsent from "@/components/analytics/AnalyticsConsent";
import Footer from "@/components/navigation/footer/Footer";
import SessionChecker from "@/components/session/SessionChecker";
import SessionProvider from "@/components/session/SessionProvider";
import { auth } from "@/auth";
import TimeoutModal from "@/components/modals/timeout/TimeoutModal";
import SplashScreen from "@/components/common/SplashScreen";


const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "My Smart Health",
  description: "Wir machen Düsseldorf gesünder.",
  openGraph: {
    title: "My Smart Health",
    description: "Wir machen Düsseldorf gesünder.",
    url: "https://my-smart-health.vercel.app/",
    siteName: "My Smart Health",
    images: [
      {
        url: "https://my-smart-health.vercel.app/og-logo-blue.jpg",
        width: 1200,
        height: 630,
        alt: "My Smart Health Logo",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="de" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${ibmPlexSans.variable} antialiased flex flex-col justify-center items-center pt-2 min-h-[100dvh] w-auto lg:max-w-3xl mx-auto p-2 overscroll-x-none border bg-white text-black`}
      >
        <SplashScreen />
        <SessionProvider session={session}>
          <SessionChecker />
          <TimeoutModal />
          <Navbar />
          <CookieConsentModal />

          <Divider addClass="my-1" />

          <main className="flex flex-col gap-2 items-center min-h-[72dvh] py-8 pt-2 w-full max-w-[99.9%] text-wrap break-normal overflow-clip overscroll-x-none">
            {children}
            <BackToTop />
          </main>
          <AnalyticsConsent />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
