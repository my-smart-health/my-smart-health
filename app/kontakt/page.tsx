
export default function KontaktPage() {
  return (
    <>
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
    </>
  );
}