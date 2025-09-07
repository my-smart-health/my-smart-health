'use client'

import GoToButton from "@/components/buttons/go-to/GoToButton";
import { PROFILE_TYPE_MEDIZIN_UND_PFLEGE, PROFILE_TYPE_SMART_HEALTH } from "@/utils/constants";
import { FormEvent, useState } from "react";

type RegisterResponse = {
  type: 'success' | 'passwordError' | 'missingName' | 'missingPhone' | 'missingEmail' | 'missingPassword' | 'missingCategory' | 'userExists' | 'someError' | 'missingFields';
};

export default function RegisterForm() {

  const [userCreatedOrError, setUserCreatedOrError] = useState<RegisterResponse | null>(null);
  const [categoryState, setCategoryState] = useState<string[]>(['']);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name');
      const phone = [formData.get('phone')?.toString()];
      const email = formData.get('email');
      const password = formData.get('password');
      const passwordConfirmation = formData.get('passwordConfirmation');
      const profileType = formData.get('profileType');
      const category = categoryState;

      if (!email || !password || !passwordConfirmation || !category || !profileType) {
        setUserCreatedOrError({ type: 'missingFields' });
        setIsDisabled(false);
        return null;
      }

      if (password !== passwordConfirmation) {
        setUserCreatedOrError({ type: 'passwordError' });
        setIsDisabled(false);
        return null;
      }

      const data = {
        name: name,
        phone: phone,
        email: email,
        password: password,
        category: category,
        profileType: profileType
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.status === 400) {
        setUserCreatedOrError({ type: 'userExists' });
        setIsDisabled(false);
        return null;
      }

      if (!res.ok) {
        setUserCreatedOrError({ type: 'someError' });
        setIsDisabled(false);
        return null;
      }

      setUserCreatedOrError({ type: 'success' });
      setIsDisabled(true);
      return await res.json();
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.error('Error registering user:', error);
      setUserCreatedOrError({ type: 'someError' });
      return null;
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`mx-auto space-y-3 sm:p-8 w-full max-w-[90%] ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
        />

        <label htmlFor="phone">Telephone Number</label>
        <input
          type="tel"
          name="phone"
          placeholder="Telephone Number"
          required
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
        />

        <label htmlFor="passwordConfirmation">Password Confirmation</label>
        <input
          type="password"
          name="passwordConfirmation"
          placeholder="Password Confirmation"
          required
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
        />

        <label htmlFor="profileType">Profile Type</label>
        <select
          name="profileType"
          required
          defaultValue="Pick a font"
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
        >
          <option disabled={true} value="">Select Profile Type</option>
          <option value={PROFILE_TYPE_SMART_HEALTH}>Smart Health</option>
          <option value={PROFILE_TYPE_MEDIZIN_UND_PFLEGE}>Medizin & Pflege</option>
        </select>

        <div className="flex flex-col w-full gap-2">
          {categoryState.map((cat, index) => (
            <div key={index} className="flex flex-col gap-2 max-w-full">
              <label htmlFor={`category-${index}`}>Category {index + 1}</label>
              <input
                type="text"
                value={cat}
                onChange={(e) => {
                  const newCategories = [...categoryState];
                  newCategories[index] = e.target.value;
                  setCategoryState(newCategories);
                }}
                placeholder="Category"
                className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => {
                  const newCategories = [...categoryState];
                  newCategories.splice(index, 1);
                  setCategoryState(newCategories);
                }}
                className="text-red-500 hover:text-red-700 transition-colors cursor-pointer place-self-end"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setCategoryState([...categoryState, ''])}
            className="p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors w-full"
          >
            Add Category
          </button>
        </div>

        {
          userCreatedOrError && userCreatedOrError.type === 'success' && (
            <div className="mb-4 p-3 rounded border text-center">
              <span className="text-green-700 border-green-400">Benutzer erfolgreich erstellt</span>
            </div>
          )
        }
        {
          userCreatedOrError && userCreatedOrError.type === 'userExists' && (
            <div className="mb-4 p-3 rounded border text-center">
              <span className="text-red-500 border-red-400">E-Mail existiert bereits</span>
            </div>
          )
        }
        {
          userCreatedOrError && userCreatedOrError.type === 'someError' && (
            <div className="mb-4 p-3 rounded border text-center">
              <span className="text-red-500 border-red-400">Ein Fehler ist aufgetreten</span>
            </div>
          )
        }
        {
          userCreatedOrError && userCreatedOrError.type === 'missingFields' && (
            <div className="mb-4 p-3 rounded border text-center">
              <span className="text-red-500 border-red-400">Bitte füllen Sie alle Felder aus</span>
            </div>
          )
        }
        {
          userCreatedOrError && userCreatedOrError.type === 'passwordError' && (
            <div className="mb-4 p-3 rounded border text-center">
              <span className="text-red-500 border-red-400">Passwörter stimmen nicht überein</span>
            </div>
          )
        }

        {
          userCreatedOrError && userCreatedOrError.type === 'missingName' && (
            <div className="mb-4 p-3 rounded border text-center">
              <span className="text-red-500 border-red-400">Bitte geben Sie Ihren Namen ein</span>
            </div>
          )
        }

        {
          userCreatedOrError && userCreatedOrError.type === 'missingPhone' && (
            <div className="mb-4 p-3 rounded border text-center">
              <span className="text-red-500 border-red-400">Bitte geben Sie Ihre Telefonnummer ein</span>
            </div>
          )
        }

        {
          userCreatedOrError && userCreatedOrError.type === 'missingEmail' && (
            <div className="mb-4 p-3 rounded border text-center">
              <span className="text-red-500 border-red-400">Bitte geben Sie Ihre E-Mail-Adresse ein</span>
            </div>
          )
        }

        {
          userCreatedOrError && userCreatedOrError.type === 'missingCategory' && (
            <div className="mb-4 p-3 rounded border text-center">
              <span className="text-red-500 border-red-400">Bitte wählen Sie eine Kategorie aus</span>
            </div>
          )
        }
        <div className="flex justify-end">
          <button
            type="submit"
            className="p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors"
          >
            Register
          </button>
        </div>

      </form >
      <div className="mt-4">
        <GoToButton src="/dashboard" name="Back to Dashboard" />
      </div>
    </>
  );
}