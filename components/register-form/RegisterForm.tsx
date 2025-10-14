'use client';

import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef, useEffect } from "react";

import { ErrorState } from "@/utils/types";

import ErrorModal from "./ErrorModal";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<ErrorState>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const errorModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (error) {
      errorModalRef.current?.showModal();
    }
  }, [error]);

  const getModalColor = () => {
    if (!error) return "";
    if (error.type === "success") return "bg-green-500";
    if (error.type === "warning") return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleError = () => {
    setIsDisabled(false);
    if (error?.type === "success") {
      setError(null);
      errorModalRef.current?.close();
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      setError(null);
      errorModalRef.current?.close();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const passwordConfirmation = formData.get("passwordConfirmation");

      if (!name) {
        setError({ type: "error", message: "Bitte geben Sie Ihren Namen ein" });
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

      if (password !== passwordConfirmation) {
        setError({ type: "warning", message: "Passwörter stimmen nicht überein" });
        setIsDisabled(false);
        return null;
      }
      setIsDisabled(true);

      const data = {
        name: name,
        email: email,
        password: password,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      if (process.env.NODE_ENV === "development") {
        console.error("Error registering user:", error);
      }
      setError({ type: "error", message: "Ein Fehler ist aufgetreten" });
      return null;
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        autoComplete="on"
        className={`mx-auto space-y-3 sm:p-8 w-full max-w-[90%] ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <label htmlFor="name">Name</label>
        <input
          id="name"
          autoComplete="on"
          type="text"
          name="name"
          placeholder="Name"
          required
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          autoComplete="on"
          type="email"
          name="email"
          placeholder="Email"
          required
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
        />

        <label htmlFor="password">Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            autoComplete="on"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            required
            className="input validator p-3 pr-12 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <label htmlFor="passwordConfirmation">Password Confirmation</label>
        <div className="relative">
          <input
            id="passwordConfirmation"
            autoComplete="on"
            type={showPasswordConfirmation ? "text" : "password"}
            name="passwordConfirmation"
            placeholder="Password Confirmation"
            required
            className="p-3 pr-12 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 bg-transparent"
            onClick={() => setShowPasswordConfirmation((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPasswordConfirmation ? "Hide password confirmation" : "Show password confirmation"}
          >
            {showPasswordConfirmation ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex mt-10 justify-end">
          <button
            type="submit"
            className="p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors"
          >
            Register
          </button>
        </div>
      </form>
      <ErrorModal
        error={error}
        errorModalRef={errorModalRef}
        getModalColor={getModalColor}
        handleError={handleError}
      />
    </>
  );
}