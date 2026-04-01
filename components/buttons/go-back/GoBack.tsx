'use client'

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function GoBack() {
  const t = useTranslations('GoBack');
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
    setTimeout(() => {
      router.refresh();
    }, 100);
  };

  return (
    <button
      onClick={handleGoBack}
      className="flex items-center text-primary btn btn-dash font-bold active:bg-primary active:text-white"
      type="button"
    >
      <ArrowLeft /> <span className="pl-2">{t('back')}</span>
    </button>
  );
}
