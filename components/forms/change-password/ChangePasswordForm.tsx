'use client';

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ErrorState } from "@/utils/types";
import StatusModal from "@/components/modals/status-modal/StatusModal";

export default function ChangePasswordForm() {
  const t = useTranslations('ChangePasswordForm');
  const { data: session } = useSession();

  const [error, setError] = useState<ErrorState>(null);

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [newPassword, setNewPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  function getPasswordStrength(password: string): "weak" | "medium" | "strong" {
    let strengthPoints = 0;

    if (password.length >= 8) strengthPoints++;
    if (/[A-Z]/.test(password)) strengthPoints++;
    if (/[0-9]/.test(password)) strengthPoints++;
    if (/[^A-Za-z0-9]/.test(password)) strengthPoints++;

    if (strengthPoints < 2) return "weak";
    if (strengthPoints === 2) return "medium";
    return "strong";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError({ type: "error", message: t('errors.enterCurrentPassword') });
      return;
    }

    if (!newPassword) {
      setError({ type: "error", message: t('errors.enterNewPassword') });
      return;
    }

    if (newPassword.length < 8) {
      setError({ type: "error", message: t('errors.minLength') });
      return;
    }

    if (newPassword !== confirmPassword) {
      setError({ type: "error", message: t('errors.passwordMismatch') });
      return;
    }

    if (password === newPassword) {
      setError({ type: "error", message: t('errors.newMustDiffer') });
      return;
    }

    try {
      const apiRoute = session?.user?.role === 'MEMBER'
        ? '/api/update/change-member-password'
        : '/api/update/change-password';

      const response = await fetch(apiRoute, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: password,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({ type: "error", message: data.error || t('errors.failedChangePassword') });
        return;
      }

      setError({ type: "success", message: t('messages.passwordChanged') });

      setTimeout(() => {
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError(null);
      }, 2000);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error changing password:', err);
      }
      setError({ type: "error", message: t('errors.generic') });
    }
  };

  return (
    <>
      <StatusModal isOpen={!!error} onCloseAction={() => setError(null)} message={error?.message || ""} type={error?.type || "success"} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-primary p-4 rounded">
        <section className="flex flex-col gap-2">
          <label>{t('currentPasswordLabel')}</label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder={t('currentPasswordPlaceholder')}
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
          <label>{t('newPasswordLabel')}</label>
          <div className="relative">
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              placeholder={t('newPasswordPlaceholder')}
              type={showNewPassword ? "text" : "password"}
              required
              className="input validator p-3 pr-12 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 z-40 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setShowNewPassword((prev) => !prev);
              }}
              tabIndex={-1}
              aria-label={showNewPassword ? t('hidePasswordAria') : t('showPasswordAria')}
            >
              {showNewPassword ? t('hide') : t('show')}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <label>{t('confirmNewPasswordLabel')}</label>
          <div className="relative">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder={t('confirmNewPasswordPlaceholder')}
              type={showConfirmPassword ? "text" : "password"}
              required
              className="input validator p-3 pr-12 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 z-40 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setShowConfirmPassword((prev) => !prev);
              }}
              tabIndex={-1}
              aria-label={showConfirmPassword ? t('hidePasswordAria') : t('showPasswordAria')}
            >
              {showConfirmPassword ? t('hide') : t('show')}
            </button>
          </div>
        </section>

        <section className="flex flex-col items-start">
          <div className={`text-sm ${newPassword.length === 0 ? "text-gray-400" : getPasswordStrength(newPassword) === "weak" ? "text-red-500" : getPasswordStrength(newPassword) === "medium" ? "text-yellow-500" : "text-green-500"}`}>
            {t('newPasswordStrengthLabel')} {newPassword.length === 0 ? t('strength.notEntered') : t(`strength.${getPasswordStrength(newPassword)}`)}
          </div>
        </section>

        <button
          type="submit"
          className="btn btn-primary p-2 rounded mt-4"
        >
          {t('updatePassword')}
        </button>
      </form>
    </>
  );
}