import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/general/Navbar";
import Link from "next/link";


const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
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
        url: "https://my-smart-health.vercel.app/Logo.jpg",
        width: 800,
        height: 600,
        alt: "My Smart Health Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${montserrat.variable} antialiased flex flex-col justify-center items-center pt-4 min-h-[100dvh] w-auto lg:max-w-md mx-auto sm:px-6 lg:px-8 overscroll-none border`}
      >
        <Navbar />
        {children}
        <footer className="flex flex-row w-full max-w-md items-center justify-center py-2 text-white font-thin bg-[#2db9bc]">
          <Link href="/impressum">IMPRESSUM</Link>
          <br />
          <span className="mx-1">|</span>
          <Link href="/datenschutz">DATENSCHUTZ</Link>
          <br />
          <span className="mx-1">|</span>
          <Link href="/kontakt">KONTAKT</Link>
        </footer>
      </body>
    </html>
  );
}
