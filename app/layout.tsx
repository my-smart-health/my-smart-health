import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/general/Navbar";


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
    url: "https://www.mysmarthealth.de",
    siteName: "My Smart Health",
    images: [
      {
        url: "https://www.mysmarthealth.de/logo.png",
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
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${montserrat.variable} antialiased flex flex-col justify-center items-center border min-h-[100dvh] w-auto max-w-screen mx-auto sm:px-6 lg:px-8 overscroll-none`}
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
