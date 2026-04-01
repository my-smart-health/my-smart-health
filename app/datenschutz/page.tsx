import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function DatenschutzPage() {
  const t = await getTranslations('PrivacyPolicy');

  const section4List = t.raw('section4.list') as string[];
  const section6List = t.raw('section6.list') as string[];

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex justify-center items-center p-2 mb-6 bg-primary">
        <h1 className="text-white text-2xl font-bold">{t('title')}</h1>
      </header>

      <section className="prose prose-lg space-y-4">
        <p>{t('intro')}</p>

        <h3>{t('section1.title')}</h3>
        <p>
          {t('section1.company')}<br />
          {t('section1.address')}<br />
          {t('section1.phone')}<br />
          E-Mail: <Link href={`mailto:${t('section1.email')}`} className="link text-primary">{t('section1.email')}</Link><br />
          Website: <Link href={t('section1.website')} target="_blank" rel="noreferrer noopener" className="link text-primary">{t('section1.website')}</Link>
        </p>

        <h3>{t('section2.title')}</h3>
        <p>
          {t('section2.name')}<br />
          E-Mail: <Link href={`mailto:${t('section2.email')}`} className="link text-primary">{t('section2.email')}</Link>
        </p>

        <h3>{t('section3.title')}</h3>
        <p>{t('section3.text')}</p>

        <h3>{t('section4.title')}</h3>
        <p>{t('section4.intro')}</p>
        <ul className="list-disc list-inside">
          {section4List.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{t('section4.text')}</p>

        <h3>{t('section5.title')}</h3>
        <p>{t('section5.text1')}</p>
        <p>{t('section5.text2')}</p>
        <p>{t('section5.text3')}</p>
        <p>{t('section5.text4')}</p>

        <h3>{t('section6.title')}</h3>
        <ul className="list-none list-inside">
          {section6List.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3>{t('section7.title')}</h3>
        <p>{t('section7.text1')}</p>
        <p>{t('section7.text2')}</p>
        <p>{t('section7.text3')}</p>

        <h3>{t('section8.title')}</h3>
        <p>{t('section8.text')}</p>

        <h3>{t('section9.title')}</h3>
        <p>{t('section9.text')}</p>

        <h3>{t('section10.title')}</h3>
        <p>{t('section10.text')}</p>

        <h3>{t('section11.title')}</h3>
        <p>{t('section11.text')}</p>
      </section>
    </main>
  );
}