import CookieSettingsButton from "@/components/modals/cookie-consent/CookieSettingsButton";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Footer() {

  const t = await getTranslations("Footer");
  return (
    <footer className="bg-primary w-full text-center text-white py-4 mt-8">
      <Link href="/impressum" className="hover:underline capitalize">
        {t("legalNotice")}
      </Link>
      <span className="mx-1">|</span>
      <Link href="/datenschutz" className="hover:underline capitalize">
        {t("privacyPolicy")}
      </Link>
      <span className="mx-1">|</span>
      <Link href="/agb" className="hover:underline">
        {t("termsAndConditions")}
      </Link>
      <span className="mx-1">|</span>
      <Link href="/kontakt" className="hover:underline capitalize">
        {t("contact")}
      </Link>
      <span className="mx-1">|</span>
      <CookieSettingsButton title={t("cookieSettings")} />
    </footer>
  )
}