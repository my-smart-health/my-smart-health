import Link from "next/link";
import { auth } from "@/auth";

import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

import Navbar from "@/components/navbar/Navbar";
import LogOut from "@/components/buttons/log-out/LogOut";
import GoBackIndexCheck from "@/components/buttons/go-back-layout/GoBackIndexCheck";


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
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${ibmPlexSans.variable} antialiased flex flex-col justify-center items-center pt-4 min-h-[100dvh] w-auto lg:max-w-3xl mx-auto p-2 overscroll-x-none border bg-white text-black`}
      >
        <Navbar />
        <GoBackIndexCheck />
        <main className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 pt-2 w-full max-w-[99.9%] text-wrap break-normal overflow-clip overscroll-x-none">
          {children}
        </main>
        <Analytics />
        <footer className="bg-primary w-full text-center text-white py-4 mt-8">
          <Link href="/impressum" className="hover:underline capitalize">
            Impressum
          </Link>
          <span className="mx-1">|</span>
          <Link href="/datenschutz" className="hover:underline capitalize">
            Datenschutz
          </Link>
          <span className="mx-1">|</span>
          <Link href="/kontakt" className="hover:underline capitalize">
            Kontakt
          </Link>
          <span className="mx-1">|</span>
          {!session?.user ? (
            <Link href="/login" className="hover:underline capitalize">
              Login
            </Link>
          ) : (
            <LogOut addClasses="link link-error hover:text-white" />
          )}
        </footer>
      </body>
    </html>
  );
}
