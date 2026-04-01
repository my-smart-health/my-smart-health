'use client';

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormEvent, useState, useRef, useEffect } from "react";

import { ErrorState } from "@/utils/types";

import ErrorModal from "./ErrorModal";


export default function RegisterForm() {
  const t = useTranslations('RegisterForm');
  const router = useRouter();
  const [error, setError] = useState<ErrorState>(null);
  const registerRoleRef = useRef<'USER' | 'MEMBER'>('USER');

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
      if (error.userId) {
        const successRoute =
          registerRoleRef.current === 'MEMBER'
            ? `/profile-member/${error.userId}`
            : `/profile/${error.userId}`;

        router.push(successRoute);
      } else {
        router.push("/dashboard");
      }
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
      const role = formData.get("role") || "USER";
      if (!name) {
        setError({ type: "error", message: t('errors.nameRequired') });
        setIsDisabled(false);
        return null;
      }
      if (!email) {
        setError({ type: "error", message: t('errors.emailRequired') });
        setIsDisabled(false);
        return null;
      }
      if (!password || !passwordConfirmation) {
        setError({ type: "error", message: t('errors.fillAllFields') });
        setIsDisabled(false);
        return null;
      }

      if (password !== passwordConfirmation) {
        setError({ type: "warning", message: t('errors.passwordsMismatch') });
        setIsDisabled(false);
        return null;
      }

      registerRoleRef.current = role === 'MEMBER' ? 'MEMBER' : 'USER';
      setIsDisabled(true);

      const data = {
        name: name,
        email: email,
        password: password,
        role: role
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 400) {
        setError({ type: "error", message: t('errors.emailExists') });
        setIsDisabled(false);
        return null;
      }

      if (!res.ok) {
        setError({ type: "error", message: t('errors.generic') });
        setIsDisabled(false);
        return null;
      }
      const responseData = await res.json();
      const userId = String(responseData.userId);
      setError({ type: "success", message: t('messages.userCreated'), userId });

      return responseData;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error registering user:", error);
      }
      setError({ type: "error", message: t('errors.generic') });
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
        <label htmlFor="name">{t('nameLabel')}</label>
        <input
          id="name"
          autoComplete="on"
          type="text"
          name="name"
          placeholder={t('namePlaceholder')}
          required
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
        />

        <label htmlFor="email">{t('emailLabel')}</label>
        <input
          id="email"
          autoComplete="on"
          type="email"
          name="email"
          placeholder={t('emailPlaceholder')}
          required
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
        />

        <label htmlFor="password">{t('passwordLabel')}</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            autoComplete="on"
            placeholder={t('passwordPlaceholder')}
            type={showPassword ? "text" : "password"}
            required
            className="input validator p-3 pr-12 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? t('hidePasswordAria') : t('showPasswordAria')}
          >
            {showPassword ? t('hide') : t('show')}
          </button>
        </div>

        <label htmlFor="passwordConfirmation">{t('passwordConfirmationLabel')}</label>
        <div className="relative">
          <input
            id="passwordConfirmation"
            autoComplete="on"
            type={showPasswordConfirmation ? "text" : "password"}
            name="passwordConfirmation"
            placeholder={t('passwordConfirmationPlaceholder')}
            required
            className="p-3 pr-12 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 bg-transparent"
            onClick={() => setShowPasswordConfirmation((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPasswordConfirmation ? t('hidePasswordConfirmationAria') : t('showPasswordConfirmationAria')}
          >
            {showPasswordConfirmation ? t('hide') : t('show')}
          </button>
        </div>

        <label htmlFor="role">{t('roleLabel')}</label>
        <div className="relative space-x-2">
          <label htmlFor="radioUser">{t('userRole')}</label>
          <input
            id="radioUser"
            type="radio"
            name="role"
            value={"USER"}
            defaultChecked
            className="radio bg-red-100 border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600" />

          <label htmlFor="radioMember">{t('memberRole')}</label>
          <input
            id="radioMember"
            type="radio"
            name="role"
            value={"MEMBER"}
            className="radio bg-blue-100 border-blue-300 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600" />

        </div>

        <div className="flex mt-10 justify-end">
          <button
            type="submit"
            className="p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors"
          >
            {t('register')}
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