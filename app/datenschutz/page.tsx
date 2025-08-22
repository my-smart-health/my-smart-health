import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <main className="flex flex-col justify-center items-center mx-auto mb-auto overflow-clip">
      <div className="flex justify-center align-baseline p-2 mb-4 mx-auto w-full bg-primary">
        <h1 className="text-white text-2xl font-bold">Datenschutz</h1>
      </div>
      <div className="mb-auto flex flex-col align-baseline justify-baseline w-full max-w-[90%]">
        <p>Datenschutzerklärung von „My Smart Health“ der Future Health GmbH</p>
        <br />
        <p>
          Wir, die Future Health GmbH, freuen uns über Ihr Vertrauen, das Sie uns durch Benutzung unserer Webseite entgegenbringen. Diesem Vertrauen möchten wir durch ein qualitativ hochwertiges Angebot gerecht werden und gleichzeitig dadurch, dass wir den Schutz Ihrer Daten die Sie uns im Vertrauen entgegenbringen sehr ernst nehmen.
        </p>
        <br />
        <p>
          Diese Datenschutzerklärung erläutert Ihnen im Folgenden, wie wir Ihre personenbezogenen Daten verarbeiten, d.h. erheben, erfassen, verwenden, offenlegen, übermitteln und speichern. Seien Sie gewiss, dass die Sicherheit und Geheimhaltung Ihre Daten bei der Future Health GmbH oberste Priorität genießen, insbesondere unter Beachtung des Bundesdatenschutzgesetzes (BDSG) und der Datenschutzgrundverordnung (DSGVO) Weiterhin beschreibt die Erklärung auch das Verhältnis Ihrer Daten in Bezug auf die ausgewählten Gesundheitsdienstleister, Krankenhäuser und Ärzte, mit denen Sie Kontakt zur Vereinbarung von Terminen aufnehmen können.
        </p>
        <br />
        <p>
          Die Future Health GmbH hat als für die Verarbeitung Verantwortlicher zahlreiche technische und organisatorische Maßnahmen umgesetzt, um einen möglichst lückenlosen Schutz der über diese Internetseite verarbeiteten personenbezogenen Daten sicherzustellen. Dennoch können Internetbasierte Datenübertragungen grundsätzlich Sicherheitslücken aufweisen, sodass ein absoluter Schutz nicht gewährleistet werden kann. Aus diesem Grund steht es jeder betroffenen Person frei, personenbezogene Daten auch auf alternativen Wegen, beispielsweise telefonisch, an uns zu übermitteln.
        </p>
        <br />
        <br />
        <p>Für die Datenverarbeitung Verantwortlicher</p>
        <br />
        <br />
        <p>Future Health GmbH
          <br />
          Wildenbruchstr. 13
          <br />
          40545 Düsseldorf
          <br />
          Deutschland
          <br />
          E-Mail: <Link href="mailto:f.jeute@spitzenmedizin.com" title="Email" className="link not-visited:text-blue-600 visited:text-purple-600">f.jeute@spitzenmedizin.com</Link>
          <br />
          Telefon: <Link href="tel:+49(0)21156634710" title="Telefon" className="link not-visited:text-blue-600 visited:text-purple-600">+49.(0)211.56634710</Link>
        </p>
        <br />
        <p>Gesetzlich vertreten durch den Geschäftsführer Herrn Dr. Ferdinand Jeute
          <br />
          HRB Nummer 72666 im Handelsregister des Amtsgerichts Düsseldorf, Deutschland
        </p>
        <br />
        <p>Bezüglich Gesundheitsdaten, die evtl. im Rahmen einer Terminvereinbarung über unsere Homepage übermittelt werden, ist verantwortliche Stelle:</p>
        <br />
        <p>Das jeweilige Krankenhaus oder der individuelle Arzt, mit dem Sie einen Termin vereinbart haben. Hierbei ist die Future Health GmbH Auftragsverarbeiter der jeweiligen Ärzte oder Krankenhäuser und handelt auf deren Weisung.</p>
        <br />
        <p>Der Nutzer entbindet die Partner der Future Health GmbH, namentlich Ärzte und Krankenhäuser in diesem Zusammenhang von der ärztlichen Schweigepflicht.</p>
        <br />
        <p>(&quot;Auftragsverarbeiter&quot; ist gemäß Art. 4 Nr.8 DSGVO eine natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet.)</p>
        <br />
        <br />
        <p>Links zu anderen Webseiten</p>
        <br />
        <p>Das Angebot enthält auch Links zu Webseiten Dritter, auf deren Inhalt die Future Health GmbH keinen Einfluss hat und deshalb für diese fremden Inhalte auch keine Gewähr übernehmen kann.</p>
        <br />
      </div >
    </main>
  )
}