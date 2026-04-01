import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "AGB - Allgemeine Geschäftsbedingungen | My Smart Health",
  description: "Allgemeine Geschäftsbedingungen von My Smart Health - Wir machen Düsseldorf gesünder.",
  openGraph: {
    title: "AGB - Allgemeine Geschäftsbedingungen | My Smart Health",
    description: "Allgemeine Geschäftsbedingungen von My Smart Health - Wir machen Düsseldorf gesünder.",
  },
};

export default async function AGBPage() {
  const t = await getTranslations("AGBPage");
  const locale = await getLocale();

  const section1List = t.raw("section1.list") as string[];
  const section2Text = t.raw("section2.text") as string[];
  const section2List = t.raw("section2.list") as string[];
  const section2Text2 = t.raw("section2.text2") as string[];
  const section3Text = t.raw("section3.text") as string[];
  const section10Text = t.raw("section10.text") as string[];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-primary mb-6">{t("title")}</h2>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h3 className="text-lg font-bold text-primary mb-3">{t("section1.title")}</h3>
          <p className="mb-2">{t("section1.text1")}</p>
          <p className="mb-2">{t("section1.text2")}</p>
          <ul className="list-disc pl-6 space-y-1">
            {section1List.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">{t("section2.title")}</h3>
          {section2Text.map((line) => (
            <p key={line} className="mb-2">
              {line}
            </p>
          ))}
          <ul className="list-disc pl-6 space-y-1 mb-2">
            {section2List.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {section2Text2.map((line) => (
            <p key={line} className="mb-2">
              {line}
            </p>
          ))}
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">{t("section3.title")}</h3>
          {section3Text.map((line) => (
            <p key={line} className="mb-2">
              {line}
            </p>
          ))}
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">{t("section4.title")}</h3>
          <p className="mb-2">{t("section4.text")}</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">{t("section5.title")}</h3>
          <p>{t("section5.text")}</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">{t("section6.title")}</h3>
          <p className="mb-2">{t("section6.text")}</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">{t("section7.title")}</h3>
          <p className="mb-2">{t("section7.text")}</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">{t("section8.title")}</h3>
          <p className="mb-2">{t("section8.text")}</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">{t("section9.title")}</h3>
          <p className="mb-2">{t("section9.text")}</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">{t("section10.title")}</h3>
          {section10Text.map((line) => (
            <p key={line} className="mb-2">
              {line}
            </p>
          ))}
        </section>

        <section className="mt-8 text-xs text-gray-600 text-center border-t border-gray-200 pt-4">
          <p>{t("footer.company")}</p>
          <p className="mt-2">
            {t("footer.date")} {new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </section>
      </div>
    </div>
  );
}
