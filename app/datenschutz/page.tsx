import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex justify-center items-center p-2 mb-6 bg-primary">
        <h1 className="text-white text-2xl font-bold">Datenschutzerklärung</h1>
      </header>

      <section className="prose prose-lg space-y-4">
        <p>
          Wir freuen uns über Ihr Interesse an unserem Unternehmen und unserer
          Website. Der Schutz Ihrer personenbezogenen Daten ist uns sehr
          wichtig. Nachfolgend informieren wir Sie über die Verarbeitung
          personenbezogener Daten im Rahmen der Nutzung unserer Website.
        </p>

        <h3>1. Verantwortlicher</h3>
        <p>
          Future Health GmbH<br />
          Wildenbruchstr. 13<br />
          40545 Düsseldorf<br />
          Deutschland<br />
          Tel.: +49 (0) 211 9241 1744<br />
          E-Mail: <Link href="mailto:info@future-health.de" className="link text-primary">info@future-health.de</Link><br />
          Website: <Link href="https://www.future-health.de/" target="_blank" rel="noreferrer noopener" className="link text-primary">https://www.future-health.de/</Link>
        </p>

        <h3>2. Datenschutzbeauftragter</h3>
        <p>
          Dr. Ferdinand Jeute<br />
          E-Mail: <Link href="mailto:info@future-health.de" className="link text-primary">info@future-health.de</Link>
        </p>

        <h3>3. Rechtsgrundlagen</h3>
        <p>
          Wir verarbeiten personenbezogene Daten ausschließlich im Einklang mit
          den Vorgaben der Datenschutz-Grundverordnung (DSGVO), dem
          Bundesdatenschutzgesetz (BDSG) sowie dem
          Telekommunikation-Telemedien-Datenschutz-Gesetz (TTDSG).
        </p>

        <h3>4. Verarbeitung personenbezogener Daten beim Besuch der Website</h3>
        <p>
          Beim Aufrufen unserer Website werden automatisch folgende Daten durch
          den Browser an unseren Server übermittelt und in Logfiles
          gespeichert:
        </p>
        <ul className="list-disc list-inside">
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>aufgerufene Seite/Datei</li>
          <li>verwendeter Browser und Betriebssystem</li>
          <li>Referrer-URL (zuvor besuchte Seite)</li>
        </ul>
        <p>
          Zwecke: Sicherstellung der Funktionsfähigkeit, Systemsicherheit,
          Fehleranalyse.<br />
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
        </p>
        <p>Die Daten werden nach spätestens 14 Tagen gelöscht.</p>

        <h3>5. Cookies und Consent-Management</h3>
        <p>
          Unsere Website verwendet Cookies und ähnliche Technologien.
        </p>
        <p>
          - Essenzielle Cookies: notwendig für den Betrieb der Website (z. B.
          Warenkorb, Login).<br />
          - Statistik-, Marketing- oder Komfort-Cookies: werden nur mit Ihrer
          ausdrücklichen Einwilligung gesetzt (§ 25 Abs. 1 TTDSG i. V. m. Art.
          6 Abs. 1 lit. a DSGVO).
        </p>
        <p>
          Beim ersten Besuch unserer Website zeigen wir Ihnen ein Consent-Banner,
          über das Sie auswählen können, welche Cookies Sie erlauben möchten.
          Diese Auswahl können Sie jederzeit in den Cookie-Einstellungen
          ändern.
        </p>

        <h3>6. Eingesetzte Dienste und Tools</h3>
        <ul className="list-none list-inside">
          <li>a) Hosting: [Hosting-Provider]</li>
          <li>b) Webanalyse: [Google Analytics / Matomo]</li>
          <li>c) Newsletter: [Mailchimp / CleverReach]</li>
          <li>d) Social Media Plugins: [Facebook, LinkedIn, Instagram]</li>
          <li>e) Videos / Karten: [YouTube, Google Maps]</li>
        </ul>

        <h3>7. Kontaktaufnahme</h3>
        <p>
          Wenn Sie uns per Kontaktformular oder E-Mail kontaktieren, werden Ihre
          Angaben (z. B. Name, E-Mail-Adresse, Anfrageinhalt) zur
          Bearbeitung gespeichert.<br />
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO oder Art. 6 Abs. 1 lit.
          f DSGVO.
        </p>

        <h3>8. Speicherdauer</h3>
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie es zur
          Erfüllung des jeweiligen Zwecks erforderlich ist oder wie es
          gesetzliche Aufbewahrungsfristen vorsehen.
        </p>

        <h3>9. Rechte der betroffenen Personen</h3>
        <p>
          Sie haben jederzeit folgende Rechte: Auskunft, Berichtigung,
          Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch,
          Widerruf, Beschwerde bei der Aufsichtsbehörde.
        </p>

        <h3>10. Automatisierte Entscheidungsfindung</h3>
        <p>
          Eine automatisierte Entscheidungsfindung oder ein Profiling findet
          nicht statt.
        </p>

        <h3>11. Aktualität dieser Datenschutzerklärung</h3>
        <p>Stand: September 2025</p>
      </section>
    </main>
  );
}