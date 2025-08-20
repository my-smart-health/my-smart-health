import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/general/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Smart Health",
  description: "Your health, smarter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-center items-center border min-h-screen w-auto max-w-screen-sm mx-auto sm:px-6 lg:px-8 overscroll-none`}
      >
        <Navbar />
        {children}
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          &copy; {new Date().getFullYear()} My Smart Health
        </footer>
      </body>
    </html>
  );
}
