import Link from "next/link";

export default function ImpressumPage() {
  return (
    <>
      <div className="flex justify-center align-baseline p-2 mb-4 mx-auto  w-full  bg-primary">
        <h1 className="text-white text-2xl font-bold">Impressum</h1>
      </div>
      <div className="mb-auto flex flex-col align-baseline justify-baseline ml-4 w-full max-w-[90%]">
        <p>Diese Webseite wird betrieben von:</p>
        <br />
        <p>
          Future Health GmbH
          <br />
          Wildenbruchstr. 13
          <br />
          40545 Düsseldorf
          <br />
          Deutschland
          <br />
          Web: <Link href="https://www.tlhow.com" title="Website" className="link not-visited:text-blue-600 visited:text-purple-600">www.tlhow.com</Link>
          <br />
          Mail: <Link href="mailto:f.jeute@spitzenmedizin.com" title="Email" className="link not-visited:text-blue-600 visited:text-purple-600">f.jeute@spitzenmedizin.com</Link>
        </p>
        <br />
        <p>
          Sitz der Gesellschaft: Düsseldorf, Deutschland
          <br />
          Vertretungsberechtigter Geschäftsführer: Dr. Ferdinand Jeute
          <br />
          HRB Nummer 72666 im Handelsregister des Amtsgericht Düsseldorf, Deutschland
          <br />
          <br />
          Umsatzsteuer-Identifikationsnummer DE295913675
        </p>
      </div>
    </>
  );
}
