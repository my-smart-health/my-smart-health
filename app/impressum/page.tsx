import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex justify-center items-center p-2 mb-6 bg-primary">
        <h1 className="text-white text-2xl font-bold">Impressum</h1>
      </header>

      <section className="prose prose-lg">
        <p className="font-bold">Future Health GmbH</p>

        <p>
          Wildenbruchstr. 13<br />
          40545 Düsseldorf<br />
          Deutschland<br />
          <Link href="mailto:info@future-health.de" className="link text-primary" target="_blank">info@future-health.de</Link>
        </p>

        <h3 className="mt-4 font-bold">GF</h3>
        <p>Dr. Ferdinand Jeute (CEO)</p>

        <h3 className="mt-4 font-bold">Handelsregister</h3>
        <p>Amtsgericht Düsseldorf, HRB / 72666</p>

        <h3 className="mt-4 font-bold">USt-IdNr. (VAT-ID):</h3>
        <p>DE 295913675</p>

        <h3 className="mt-4 font-bold">Inhaltlich verantwortlich nach § 18 Abs. 2 MStV:</h3>
        <p>
          Dr. Ferdinand Jeute<br />
          Wildenbruchstr. 13<br />
          40545 Düsseldorf<br />
          Deutschland
        </p>

        <br />

        <p>
          Die EU-Kommission stellt eine Plattform für die Online-Streitbeilegung
          (OS) bereit. Sie finden diese unter{' '}
          <Link href="https://ec.europa.eu/consumers/odr/" target="_blank" className="link text-primary">https://ec.europa.eu/consumers/odr/</Link>.
        </p>
        <p>
          Future Health ist weder bereit noch verpflichtet, an einem
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </section>
    </main>
  );
}
