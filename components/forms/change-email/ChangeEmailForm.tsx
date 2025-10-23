'use client';

import { useState } from "react";
import { ErrorState } from "@/utils/types";
import StatusModal from "@/components/modals/status-modal/StatusModal";

type Props = {
  currentEmail: string;
};

export default function ChangeEmailForm({ currentEmail }: Props) {

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
      return { valid: false, message: "Not entered", color: "text-gray-400" };
    }
    if (!validateEmail(newEmail)) {
      return { valid: false, message: "Invalid format", color: "text-red-500" };
    }
    if (newEmail === currentEmail) {
      return { valid: false, message: "Same as current", color: "text-yellow-500" };
    }
    return { valid: true, message: "Valid", color: "text-green-500" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError({ type: "error", message: "Please enter your password." });
      return;
    }

    if (!newEmail) {
      setError({ type: "error", message: "Please enter a new email." });
      return;
    }

    if (!validateEmail(newEmail)) {
      setError({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    if (newEmail !== confirmEmail) {
      setError({ type: "error", message: "Email addresses do not match." });
      return;
    }

    if (newEmail === currentEmail) {
      setError({ type: "error", message: "New email must be different from current email." });
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
        setError({ type: "error", message: data.error || "Failed to change email." });
        return;
      }

      setError({ type: "success", message: "Email changed successfully! Please log in again with your new email." });

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
      setError({ type: "error", message: "An error occurred. Please try again." });
    }
  };

  return (
    <>
      <StatusModal isOpen={!!error} onCloseAction={() => setError(null)} message={error?.message || ""} type={error?.type || "success"} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-primary p-4 rounded">
        <section className="flex flex-col gap-2">
          <label>Current Email:</label>
          <input
            value={currentEmail}
            disabled
            className="input p-3 rounded border border-gray-300 bg-gray-100 text-base text-gray-500 cursor-not-allowed w-full max-w-full"
          />
        </section>

        <section className="flex flex-col gap-2">
          <label>Password:</label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
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
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <label>New Email:</label>
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            autoComplete="email"
            placeholder="New Email"
            type="email"
            required
            className="input validator p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
          />
        </section>

        <section className="flex flex-col gap-2">
          <label>Confirm New Email:</label>
          <input
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            autoComplete="email"
            placeholder="Confirm New Email"
            type="email"
            required
            className="input validator p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
          />
        </section>

        <section className="flex flex-col items-start">
          <div className={`text-sm ${getEmailStatus().color}`}>
            New Email Status: {getEmailStatus().message}
          </div>
        </section>

        <button
          type="submit"
          className="btn btn-primary p-2 rounded mt-4"
        >
          Update Email
        </button>
      </form>
    </>
  );
}
