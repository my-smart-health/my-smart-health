'use client'
import { AtSign, Globe, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function TheHealthBarInfo() {
  const t = useTranslations('TheHealthBarInfo');
  const currentTime = new Date();
  const day = currentTime.getDay();
  const hour = currentTime.getHours();
  let isOpen = false;

  if (day >= 1 && day <= 5) {
    isOpen = hour >= 10 && hour < 20;
  } else if (day === 6) {
    isOpen = hour >= 10 && hour < 16;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 justify-center gap-3 text-wrap text-start ">
        <p className="flex">
          <Phone /> <span className="pl-2">+ 49 123 456 7890</span>
        </p>
        <p className="flex">
          <AtSign /> <Link href="mailto:info@shop.de" className="pl-2 visited:text-purple-500 not-visited:text-primary">info@shop.de</Link>
        </p>
        <p className="flex">
          <Globe /> <Link href="https://www.healthbar.de" className="pl-2 visited:text-purple-500 not-visited:text-primary">www.healthbar.de</Link>
        </p>
        <p className="flex">
          <MapPin />
          <span className="pl-2">{t('address')}</span>
        </p>
      </div>
      <div className="grid sm:col-span-2 mt-4 gap-1">
        <div className="flex justify-start">
          <p className="flex justify-start mb-2">
            {t('openingHours')}
          </p>
          <p className="pl-4">
            {isOpen ? <span className="text-green-500/95">{t('open')}</span> : <span className="text-red-500/95">{t('closed')}</span>}
          </p>
        </div>
        <div className="flex flex-col gap-2 justify-evenly">
          <div className="flex flex-row ">
            <p className="text-start">{t('mondayToFriday')}</p>
            <p className="pl-2">{t('weekdayHours')}</p>
          </div>
          <div className="flex flex-row ">
            <p className="text-start">{t('saturday')}</p>
            <p className="pl-18">{t('saturdayHours')}</p>
          </div>
        </div>
      </div>
    </>
  );
}
