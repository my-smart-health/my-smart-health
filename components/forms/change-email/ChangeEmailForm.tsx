'use client';

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ErrorState } from "@/utils/types";
import StatusModal from "@/components/modals/status-modal/StatusModal";

type Props = {
  currentEmail: string;
};

export default function ChangeEmailForm({ currentEmail }: Props) {
  const t = useTranslations('ChangeEmailForm');

  const [error, setError] = useState<ErrorState>(null);

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [newEmail, setNewEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailStatus = (): { valid: boolean; message: string; color: string } => {
    if (newEmail.length === 0) {
      return { valid: false, message: t('status.notEntered'), color: "text-gray-400" };
    }
    if (!validateEmail(newEmail)) {
      return { valid: false, message: t('status.invalidFormat'), color: "text-red-500" };
    }
    if (newEmail === currentEmail) {
      return { valid: false, message: t('status.sameAsCurrent'), color: "text-yellow-500" };
    }
    return { valid: true, message: t('status.valid'), color: "text-green-500" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError({ type: "error", message: t('errors.enterPassword') });
      return;
    }

    if (!newEmail) {
      setError({ type: "error", message: t('errors.enterNewEmail') });
      return;
    }

    if (!validateEmail(newEmail)) {
      setError({ type: "error", message: t('errors.validEmail') });
      return;
    }

    if (newEmail !== confirmEmail) {
      setError({ type: "error", message: t('errors.emailMismatch') });
      return;
    }

    if (newEmail === currentEmail) {
      setError({ type: "error", message: t('errors.newMustDiffer') });
      return;
    }

    try {
      const response = await fetch('/api/update/change-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: password,
          newEmail: newEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({ type: "error", message: data.error || t('errors.failedChangeEmail') });
        return;
      }

      setError({ type: "success", message: t('messages.emailChanged') });

      setTimeout(() => {
        setPassword("");
        setNewEmail("");
        setConfirmEmail("");
        setError(null);
      }, 3000);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error changing email:', err);
      }
      setError({ type: "error", message: t('errors.generic') });
    }
  };

  return (
    <>
      <StatusModal isOpen={!!error} onCloseAction={() => setError(null)} message={error?.message || ""} type={error?.type || "success"} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-primary p-4 rounded">
        <section className="flex flex-col gap-2">
          <label>{t('currentEmailLabel')}</label>
          <input
            value={currentEmail}
            disabled
            className="input p-3 rounded border border-gray-300 bg-gray-100 text-base text-gray-500 cursor-not-allowed w-full max-w-full"
          />
        </section>

        <section className="flex flex-col gap-2">
          <label>{t('passwordLabel')}</label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder={t('passwordPlaceholder')}
              type={showPassword ? "text" : "password"}
              required
              className="input validator p-3 pr-12 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 z-40 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword((prev) => !prev);
              }}
              tabIndex={-1}
              aria-label={showPassword ? t('hidePasswordAria') : t('showPasswordAria')}
            >
              {showPassword ? t('hide') : t('show')}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <label>{t('newEmailLabel')}</label>
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            autoComplete="email"
            placeholder={t('newEmailPlaceholder')}
            type="email"
            required
            className="input validator p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
          />
        </section>

        <section className="flex flex-col gap-2">
          <label>{t('confirmNewEmailLabel')}</label>
          <input
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            autoComplete="email"
            placeholder={t('confirmNewEmailPlaceholder')}
            type="email"
            required
            className="input validator p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
          />
        </section>

        <section className="flex flex-col items-start">
          <div className={`text-sm ${getEmailStatus().color}`}>
            {t('newEmailStatusLabel')} {getEmailStatus().message}
          </div>
        </section>

        <button
          type="submit"
          className="btn btn-primary p-2 rounded mt-4"
        >
          {t('updateEmail')}
        </button>
      </form>
    </>
  );
}
