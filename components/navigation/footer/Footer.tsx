'use client';

import LogOut from "@/components/buttons/log-out/LogOut";
import CookieSettingsButton from "@/components/modals/cookie-consent/CookieSettingsButton";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Footer() {
  const { data: session } = useSession();

  return (
    <footer className="bg-primary w-full text-center text-white py-4 mt-8">
      <Link href="/impressum" className="hover:underline capitalize">
        Impressum
      </Link>
      <span className="mx-1">|</span>
      <Link href="/datenschutz" className="hover:underline capitalize">
        Datenschutz
      </Link>
      <span className="mx-1">|</span>
      <Link href="/agb" className="hover:underline">
        AGB
      </Link>
      <span className="mx-1">|</span>
      <Link href="/kontakt" className="hover:underline capitalize">
        Kontakt
      </Link>
      <span className="mx-1">|</span>
      <CookieSettingsButton />
      <span className="mx-1">|</span>
      {!session?.user ? (
        <Link href="/login" className="hover:underline capitalize">
          Login
        </Link>
      ) : (
        <LogOut addClasses="link link-error hover:text-white" />
      )}
    </footer>
  )
}