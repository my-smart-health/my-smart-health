import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AGB - Allgemeine Geschäftsbedingungen | My Smart Health",
  description: "Allgemeine Geschäftsbedingungen von My Smart Health - Wir machen Düsseldorf gesünder.",
  openGraph: {
    title: "AGB - Allgemeine Geschäftsbedingungen | My Smart Health",
    description: "Allgemeine Geschäftsbedingungen von My Smart Health - Wir machen Düsseldorf gesünder.",
  },
};

export default function AGBPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-primary mb-6">
          Nutzungsvertrag - Allgemeine Geschäftsbedingungen (AGB) über die Plattform
          mysmart.health
        </h2>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">§ 1 Vertragsgegenstand</h3>
          <p className="mb-2">
            Der Anbieter die <strong>„Future Health GmbH Wildenbruchstr. 13 ,40545 Düsseldorf -
              Amtsgericht Düsseldorf, HRB / 72666 vertreten durch den Geschäftsführer Dr.
              Ferdinand Jeute Email <Link href="mailto:jeute@future-health.de" className="link text-blue-600">jeute@future-health.de</Link>&quot;</strong> betreibt die digitale Plattform
            mysmart.health, die Unternehmen und Organisationen eine Präsentation sowie digitale
            Gesundheitsleistungen zur Verfügung stellt.
            <br />
            Gegenstand dieses Vertrages ist die zeitlich beschränkte Integration und Nutzung der
            Plattform durch den Partner für folgende Zwecke:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Digitale Darstellung und Marketingpräsenz des Partnerunternehmens auf der Plattform,</li>
            <li>Zugriff auf digitale Inhalte und Gesundheitsangebote von mysmart.health,</li>
            <li>Teilnahme an mysmart.health-Initiativen und digitalen Events.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">§ 2 Vertragsbeginn und Laufzeit</h3>
          <p className="mb-2">
            Der Vertrag tritt mit der Registrierung des Teilnehmers durch beide Parteien in Kraft.
            Er wird auf unbestimmte Zeit geschlossen und ist monatlich kündbar.
            <br />
            Die Kündigung muss schriftlich oder in Textform (E-Mail genügt) bis spätestens 14 Tage vor
            Monatsende erfolgen.
            <br />
          </p>
          <p className="mb-2">
            Zur Einrichtung eines Administrator-Accounts werden folgende Angaben benötigt:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name des Lizenznehmers</li>
            <li>Anschrift des Lizenznehmers</li>
            <li>E-Mail-Adresse</li>
            <li>Einrichtung eines Zahlungsmittels</li>
          </ul>
          <p>
            Durch Registrierung gelangt der Administrator des Teilnehmers in den
            <br />
            Administrationsbereich von Future Health bzw. eigener Future Health Seiten. Die Daten des
            Administrator-Accounts können über die Account-Einstellung jederzeit geändert werden.
            <br />
            Bei darauffolgenden Anmeldevorgängen ist die Eingabe der hinterlegten E-Mail-Adresse
            sowie des Passwortes erforderlich. Ein Ändern des Passwortes ist ausschließlich in den
            Account-Einstellungen möglich.
            <br />
            (Der Inhaber bzw. Administrator des Teilnehmers ist für die sichere Aufbewahrung der
            Account-Zugangsdaten verantwortlich. Durch einen etwaigen Verlust entstehenden Schaden
            kommt der Lizenzgeber nicht auf.
          </p>

        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">§ 3 Vergütung</h3>
          <p className="mb-2">
            Die Nutzung der Plattform ist ab Vertragsbeginn kostenpflichtig.
            <br />
            Die Vergütung richtet sich nach der jeweils gültigen Preisliste bzw. dem individuell
            <br />
            vereinbarten monatlichen Nutzungsentgelt.
            <br />
            Zahlungen sind monatlich im Voraus ohne Abzug fällig.
            <br />
            Der Anbieter ist berechtigt, Preise mit einer Frist von 30 Tagen zum Monatsende
            anzupassen.
          </p>


        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">§ 4 Leistungen des Anbieters</h3>
          <p className="mb-2">
            Der Anbieter stellt dem Partner Zugang zur Plattform mysmart.health bereit und ermöglicht
            die Nutzung der angebotenen Funktionen.
            <br />
            Der Anbieter sorgt für eine technische Verfügbarkeit der Plattform von mindestens 95 % im
            Monatsmittel.
            <br />
            Inhaltliche und technische Änderungen, die der Weiterentwicklung der Plattform dienen,
            bleiben vorbehalten.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">§ 5 Pflichten des Partners</h3>
          <p>
            Der Partner verpflichtet sich, die Plattform ausschließlich im Rahmen des vertraglichen
            Zwecks zu nutzen.
            <br />
            Der Partner ist für die von ihm veröffentlichten Inhalte selbst verantwortlich.
            <br />
            Der Partner darf keine rechtswidrigen oder diskriminierenden Inhalte veröffentlichen.
            <br />
            Marken, Logos und Materialien von mysmart.health dürfen nur im Rahmen dieser
            Kooperation genutzt werden.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">§ 6 Nutzungsrechte</h3>
          <p className="mb-2">
            Der Anbieter räumt dem Partner ein einfaches, nicht übertragbares Nutzungsrecht an der
            Plattform für die Vertragsdauer ein.
            <br />
            Eine Weitergabe von Zugängen oder Inhalten an Dritte ist untersagt.
            <br />
            Alle Rechte an der Plattform, den Inhalten und Designs verbleiben beim Anbieter.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">§ 7 Haftung</h3>
          <p className="mb-2">
            Der Anbieter haftet nur bei Vorsatz und grober Fahrlässigkeit.
            <br />
            Für Datenverluste oder indirekte Schäden wird keine Haftung übernommen.
            <br />
            Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">§ 8 Datenschutz</h3>
          <p className="mb-2">
            Beide Parteien verpflichten sich zur Einhaltung der Datenschutzbestimmungen gemäß
            DSGVO.
            <br />
            Personenbezogene Daten werden ausschließlich zum Zwecke der Vertragserfüllung
            verarbeitet.
            <br />
            Näheres regelt eine gesonderte Datenschutzvereinbarung (AV-Vertrag), sofern erforderlich.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">§ 9 Vertraulichkeit</h3>
          <p className="mb-2">
            Beide Parteien verpflichten sich, alle im Rahmen dieses Vertrages erlangten vertraulichen
            Informationen streng vertraulich zu behandeln und Dritten nicht zugänglich zu machen.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">§ 10 Schlussbestimmungen</h3>
          <p className="mb-2">
            Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform.
            <br />
            Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen
            Bestimmungen unberührt.
            <br />
            Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
            Gerichtsstand ist Düsseldorf.
          </p>
        </section>

        <section className="mt-8 text-xs text-gray-600 text-center border-t border-gray-200 pt-4">
          <p>Future Health GmbH · Wildenbruchstr. 13 · 40545 Düsseldorf · www.mysmart.health · info@mysmart.health</p>
          <p className="mt-2">Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </section>
      </div>
    </div>
  );
}
