import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function TheHealthBarLink() {
  const t = await getTranslations('TheHealthBarLink');
  return (
    <Link
      draggable={false}
      href="/the-health-bar"
      className="flex justify-center items-center w-full mx-auto max-w-[90%]"
      title={t('title')}
    >
      <Image
        src="/unserHealthShop.png"
        alt={t('title')}
        width={800}
        height={150}
        className="w-full h-auto border-2 border-primary rounded-2xl p-4 mt-4"
        style={{ objectFit: "contain" }}
      />
    </Link>
  );
}
