'use client'

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import StatusModal from "../modals/status-modal/StatusModal";
import { ErrorState } from "@/utils/types";
import Link from "next/link";

export default function LoginForm() {
  const t = useTranslations('LoginForm');
  const [error, setError] = useState<ErrorState>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (!response?.error) {
      window.location.href = '/dashboard';
      return response;
    }

    setError({ type: "error", message: t('errors.invalidCredentials') });
  };

  return (
    <>
      <StatusModal
        isOpen={!!error}
        onCloseAction={() => setError(null)}
        message={error?.message || ""}
        type={error?.type || "success"}
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 rounded-lg bg-white shadow-md max-w-[90%]"
      >
        <label htmlFor="email">{t('emailLabel')}</label>
        <input
          type="email"
          name="email"
          placeholder={t('emailPlaceholder')}
          required
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
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

        <button
          type="submit"
          className="p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors"
        >
          {t('login')}
        </button>
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          {t('forgotPassword')}
        </Link>
      </form>
    </>
  );
}