'use client';

import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef, useEffect } from "react";
import ErrorModal from "./ErrorModal";
import {
  PROFILE_TYPE_MEDIZIN_UND_PFLEGE,
  PROFILE_TYPE_SMART_HEALTH,
} from "@/utils/constants";
import CategoryInputList from "./_components/CategoryInputList";

type ErrorType = "success" | "warning" | "error";
type ErrorState = { type: ErrorType; message: string } | null;

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<ErrorState>(null);
  const [profileType, setProfileType] = useState<string>("");
  const [categoryState, setCategoryState] = useState<string[]>([""]);
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
      const name = formData.get("name");
      const phone = [formData.get("phone")?.toString()];
      const email = formData.get("email");
      const password = formData.get("password");
      const passwordConfirmation = formData.get("passwordConfirmation");
      const profileTypeData: string = profileType;
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
        profileType: profileTypeData,
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
        className={`mx-auto space-y-3 sm:p-8 w-full max-w-[90%] ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
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

        <label htmlFor="profileType">Profile Type
          <select
            required
            name="profileType"
            value={profileType}
            onChange={(e) => {
              setProfileType(e.target.value);
              setCategoryState([""]);
            }}
            className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
          >
            <option disabled={true} value="">Select Profile Type</option>
            <option value={PROFILE_TYPE_SMART_HEALTH}>Smart Health</option>
            <option value={PROFILE_TYPE_MEDIZIN_UND_PFLEGE}>Medizin & Pflege</option>
          </select>
        </label>
        <CategoryInputList
          profileType={profileType}
          categoryState={categoryState}
          setCategoryState={setCategoryState}
        />
        <div className="flex justify-end">
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