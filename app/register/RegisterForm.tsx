'use client'

import GoToButton from "@/components/buttons/go-to/GoToButton";
import { FormEvent, useState } from "react";

type RegisterResponse = {
  type: 'success' | 'passwordError' | 'userExists' | 'someError' | 'missingFields';
};

export default function RegisterForm() {

  const [userCreatedOrError, setUserCreatedOrError] = useState<RegisterResponse | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email');
      const password = formData.get('password');
      const passwordConfirmation = formData.get('passwordConfirmation');

      if (!email || !password || !passwordConfirmation) {
        setUserCreatedOrError({ type: 'missingFields' });
        return null;
      }

      if (password !== passwordConfirmation) {
        setUserCreatedOrError({ type: 'passwordError' });
        return null;
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (res.status === 400) {
        setUserCreatedOrError({ type: 'userExists' });
        return null;
      }

      if (!res.ok) {
        setUserCreatedOrError({ type: 'someError' });
        return null;
      }

      setUserCreatedOrError({ type: 'success' });
      return await res.json();
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.error('Error registering user:', error);
      setUserCreatedOrError({ type: 'someError' });
      return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-8 rounded-lg bg-white shadow-md max-w-[90%] "
    >
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        name="passwordConfirmation"
        placeholder="Password Confirmation"
        required
        className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {userCreatedOrError && userCreatedOrError.type === 'success' && (
        <div className="mb-4 p-3 rounded border text-center">
          <span className="text-green-700 border-green-400">Benutzer erfolgreich erstellt</span>
        </div>
      )}
      {userCreatedOrError && userCreatedOrError.type === 'userExists' && (
        <div className="mb-4 p-3 rounded border text-center">
          <span className="text-red-500 border-red-400">E-Mail existiert bereits</span>
        </div>
      )}
      {userCreatedOrError && userCreatedOrError.type === 'someError' && (
        <div className="mb-4 p-3 rounded border text-center">
          <span className="text-red-500 border-red-400">Ein Fehler ist aufgetreten</span>
        </div>
      )}
      {userCreatedOrError && userCreatedOrError.type === 'missingFields' && (
        <div className="mb-4 p-3 rounded border text-center">
          <span className="text-red-500 border-red-400">Bitte füllen Sie alle Felder aus</span>
        </div>
      )}
      {userCreatedOrError && userCreatedOrError.type === 'passwordError' && (
        <div className="mb-4 p-3 rounded border text-center">
          <span className="text-red-500 border-red-400">Passwörter stimmen nicht überein</span>
        </div>
      )}
      <button
        type="submit"
        className="p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors"
      >
        Register
      </button>

      <div className="mt-4">
        <GoToButton src="/dashboard" name="Back to Dashboard" />
      </div>
    </form>
  );
}