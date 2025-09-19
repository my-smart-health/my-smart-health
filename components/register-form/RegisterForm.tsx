'use client'

import { PROFILE_TYPE_MEDIZIN_UND_PFLEGE, PROFILE_TYPE_SMART_HEALTH } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef, useEffect } from "react";
import GoBack from "../buttons/go-back/GoBack";

type ErrorType = "success" | "warning" | "error";
type ErrorState = { type: ErrorType; message: string } | null;

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<ErrorState>(null);
  const [categoryState, setCategoryState] = useState<string[]>(['']);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const errorModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (error) {
      errorModalRef.current?.showModal();
    }
  }, [error]);

  const getModalColor = () => {
    if (!error) return '';
    if (error.type === "success") return 'bg-green-500';
    if (error.type === "warning") return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleError = () => {
    setIsDisabled(false);
    if (error?.type === "success") {
      setError(null);
      errorModalRef.current?.close();
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } else {
      setError(null);
      errorModalRef.current?.close();
    }
  };

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

      if (!name) {
        setError({ type: "error", message: "Bitte geben Sie Ihren Namen ein" });
        setIsDisabled(false);
        return null;
      }
      if (!phone || !phone[0]) {
        setError({ type: "error", message: "Bitte geben Sie Ihre Telefonnummer ein" });
        setIsDisabled(false);
        return null;
      }
      if (!email) {
        setError({ type: "error", message: "Bitte geben Sie Ihre E-Mail-Adresse ein" });
        setIsDisabled(false);
        return null;
      }
      if (!password || !passwordConfirmation) {
        setError({ type: "error", message: "Bitte füllen Sie alle Felder aus" });
        setIsDisabled(false);
        return null;
      }
      if (!category || !category[0]) {
        setError({ type: "error", message: "Bitte wählen Sie eine Kategorie aus" });
        setIsDisabled(false);
        return null;
      }
      if (!profileType) {
        setError({ type: "error", message: "Bitte wählen Sie eine Kategorie aus" });
        setIsDisabled(false);
        return null;
      }
      if (password !== passwordConfirmation) {
        setError({ type: "warning", message: "Passwörter stimmen nicht überein" });
        setIsDisabled(false);
        return null;
      }
      setIsDisabled(true);

      const data = {
        name: name,
        phone: phone,
        email: email,
        password: password,
        category: category,
        profileType: profileType
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.status === 400) {
        setError({ type: "error", message: "E-Mail existiert bereits" });
        setIsDisabled(false);
        return null;
      }

      if (!res.ok) {
        setError({ type: "error", message: "Ein Fehler ist aufgetreten" });
        setIsDisabled(false);
        return null;
      }

      setError({ type: "success", message: "Benutzer erfolgreich erstellt" });

      return await res.json();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error registering user:', error);
      }
      setError({ type: "error", message: "Ein Fehler ist aufgetreten" });
      return null;
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`mx-auto space-y-3 sm:p-8 w-full max-w-[90%] ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="flex justify-end ">
          <GoBack />
        </div>
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

        <div className="flex justify-end">
          <button
            type="submit"
            className="p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors"
          >
            Register
          </button>
        </div>
      </form>

      {error && (
        <dialog
          ref={errorModalRef}
          id="register_error_modal"
          className="modal modal-bottom backdrop-grayscale-100 transition-all ease-linear duration-500"
          style={{ backgroundColor: 'transparent' }}
          onClose={handleError}
        >
          <div
            className={`modal-box ${getModalColor()} text-white rounded-2xl w-[95%]`}
            style={{
              width: "80vw",
              maxWidth: "80vw",
              margin: '2rem auto',
              left: 0,
              right: 0,
              bottom: 0,
              position: "fixed",
              minHeight: "unset",
              padding: "2rem 1.5rem"
            }}
          >
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white"
                onClick={handleError}
                type="button"
              >✕</button>
            </form>
            <h3 className="font-bold text-lg">
              {error.type === 'success'
                ? 'Erfolg'
                : error.type === 'warning'
                  ? 'Warnung'
                  : 'Fehler'}
            </h3>
            <p className="py-4 text-center">{error.message}</p>
          </div>
        </dialog>
      )}
    </>
  );
}