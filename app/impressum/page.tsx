import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function ImpressumPage() {
  const t = await getTranslations('LegalNotice');

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex justify-center items-center p-2 mb-6 bg-primary">
        <h1 className="text-white text-2xl font-bold">{t('title')}</h1>
      </header>

      <section className="prose prose-lg">
        <p className="font-bold">{t('company')}</p>

        <p>
          {t('address.street')}<br />
          {t('address.city')}<br />
          {t('address.country')}<br />
          <Link href={`mailto:${t('address.email')}`} className="link text-primary">{t('address.email')}</Link>
        </p>

        <h3 className="mt-4 font-bold">{t('ceo.title')}</h3>
        <p>{t('ceo.name')}</p>

        <h3 className="mt-4 font-bold">{t('register.title')}</h3>
        <p>{t('register.value')}</p>

        <h3 className="mt-4 font-bold">{t('vat.title')}</h3>
        <p>{t('vat.value')}</p>

        <h3 className="mt-4 font-bold">{t('responsible.title')}</h3>
        <p>
          {t('responsible.name')}<br />
          {t('responsible.address')}
        </p>

        <br />

        <p>
          {t('eu.text1')} {' '}
          <Link href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer noopener" className="link text-primary">https://ec.europa.eu/consumers/odr/</Link>.
        </p>
        <p>{t('eu.text2')}</p>
      </section>
    </main>
  );
}
