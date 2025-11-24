
'use client';

import { useState, FormEvent } from 'react';
import StatusModal from '@/components/modals/status-modal/StatusModal';

export default function KontaktPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      surname: formData.get('surname') as string,
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        setMessage({ type: 'error', text: result.error || 'Ein Fehler ist aufgetreten.' });
        setLoading(false);
        return;
      }

      form.reset();
      setMessage({ type: 'success', text: 'Ihre Nachricht wurde erfolgreich gesendet!' });
    } catch (error) {
      console.error('Contact form error:', error);
      setMessage({ type: 'error', text: 'Netzwerkfehler. Bitte versuchen Sie es später erneut.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center align-baseline p-4 mb-4 mx-auto w-full bg-primary rounded-lg">
        <h1 className="text-white text-2xl font-bold">Kontakt</h1>
        <br />
        <p className="text-white">Falls Sie Fragen haben, senden Sie uns gern eine email. Füllen Sie dazu das Mailformular aus und klicken Sie auf senden. Alle Felder sind Pflichtfelder.</p>
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">Vorname *</label>
            <input
              type="text"
              id="surname"
              name="surname"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nachricht *</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Wird gesendet...' : 'Senden'}
          </button>
        </form>
      </div>

      <StatusModal
        isOpen={!!message}
        onCloseAction={() => setMessage(null)}
        message={message?.text || ''}
        type={message?.type || 'success'}
      />
    </>
  );
}