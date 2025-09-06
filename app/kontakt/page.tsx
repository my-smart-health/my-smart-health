import Link from "next/link";

export default function KontaktPage() {
  return (
    <main className="flex flex-col justify-center items-center mx-auto mb-auto overflow-clip overscroll-none">
      <div className="flex justify-center align-baseline p-2 mb-4 mx-auto w-full bg-primary">
        <h1 className="text-white text-2xl font-bold">Impressum</h1>
      </div>
      <div className="flex flex-col align-baseline justify-baseline w-full max-w-[90%]">
        <p>Anbieter dieser Webseite ist:</p>
        <br />
        <p>
          Verein zur Förderung der Patienteninteressen im Gesundheitswesen e.V.
          <br />
          Wildenbruchstr. 13
          <br />
          40545 Düsseldorf
          <br />
          Deutschland
          <br />
          Mail: <Link href="mailto:f.jeute@spitzenmedizin.com" title="Email" className="link not-visited:text-blue-600 visited:text-purple-600">f.jeute@spitzenmedizin.com</Link>
          <br />
          Telefon: <Link href="tel:+49(0)21156634710" title="Telefon" className="link not-visited:text-blue-600 visited:text-purple-600">+49.(0)211.56634710</Link>
        </p>
        <br />
        <p>vertreten durch den Vorstand: Dr. Ferdinand Jeute (Vorsitzender), Olaf Joachim Lehne, Fabian-Konstantin Otto Hans-Gottfried Kränzlin</p>
        <br />
        <p>Vereinsregister Nummer: AG Düsseldorf, Vereinsregister 11546</p>
        <br />
        <h2 className="font-bold">Online-Streitbeilegungsplattform der EU-Kommission</h2>
        <br />
        <p className="text-wrap">Die Online-Streitbeilegungsplattform („OS-Plattform“) zur außergerichtlichen Beilegung von Streitigkeiten aus online abgeschlossenen Verträgen erreichen Sie unter folgendem Link:
          <br />
          <Link href="https://ec.europa.eu/consumers/odr/" className="link not-visited:text-blue-600 visited:text-purple-600 text-wrap">https://ec.europa.eu/consumers/odr/</Link>
        </p>
        <br />
        <h2 className="font-bold">Informationspflicht nach dem Verbraucherstreitbeilegungsgesetz</h2>
        <br />
        <p>Der Verein zur Förderung der Patienteninteressen im Gesundheitswesen e.V. nimmt nicht an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil.</p>
        <br />
        <h2 className="font-bold">Urheberrecht</h2>
        <br />
        <p>Die Inhalte dieser Webseite sind urheberrechtlich geschützt. Vervielfältigung, Verbreitung und/oder öffentlich Wiedergabe ohne Einwilligung des Verein zur Förderung der Patienteninteressen im Gesundheitswesen e.V. ist unzulässig.</p>
      </div >
      <br />
      <div className="flex flex-col justify-center align-baseline p-2 mb-4 mx-auto w-full bg-primary">
        <h1 className="text-white text-2xl font-bold">Kontakt</h1>
        <br />
        <p className="text-white">Falls Sie Fragen haben, senden Sie uns gern eine email. Füllen Sie dazu das Mailformular aus und klicken Sie auf senden. Alle Felder sind Pflichtfelder.</p>
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
        <form className="w-full">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" name="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div className="mb-4">
            <label htmlFor="vorname" className="block text-sm font-medium text-gray-700">Vorname</label>
            <input type="text" id="vorname" name="vorname" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div className="mb-4">
            <label htmlFor="telefon" className="block text-sm font-medium text-gray-700">Telefon</label>
            <input type="text" id="telefon" name="telefon" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Nachricht</label>
            <textarea id="message" name="message" rows={4} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"></textarea>
          </div>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">Senden</button>
        </form>
      </div>
    </main>
  );
}