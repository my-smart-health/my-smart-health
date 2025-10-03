'use client';

import { useState } from "react";
import { ErrorState } from "@/utils/types";
import StatusModal from "@/components/modals/status-modal/StatusModal";

type Props = {
  user: { password: string };

};

export default function ChangePasswordForm({ user }: Props) {

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
    if (user.password) {
      setError({ type: "error", message: "Current password is incorrect." });
      return;
    }

    // Call API to change password
  };

  return (
    <>
      <StatusModal isOpen={!!error} onCloseAction={() => setError(null)} message={error?.message || ""} type={error?.type || "success"} />
      <form className="flex flex-col gap-4 border border-primary p-4 rounded">
        MUST REFACTOR THE COMPONENT!!! NOT READY !!!
        <section className="flex flex-col gap-2">
          <label>Current Password:</label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="on"
              placeholder="Current Password"
              type={showPassword ? "text" : "password"}
              required
              className="input validator p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <label>New Password:</label>
          <div className="relative">
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="on"
              placeholder="New Password"
              type={showNewPassword ? "text" : "password"}
              required
              className="input validator p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowNewPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <label>Confirm New Password:</label>
          <div className="relative">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="on"
              placeholder="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              required
              className="input validator p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </section>

        <section className={`flex flex-col items-start ${newPassword.length > 0 ? "" : "hidden"}`}>
          <div className={`text-sm ${getPasswordStrength(newPassword) === "weak" ? "text-red-500" : getPasswordStrength(newPassword) === "medium" ? "text-yellow-500" : "text-green-500"}`}>
            New Password Strength: {getPasswordStrength(newPassword)[0].toUpperCase() + getPasswordStrength(newPassword).slice(1)}
          </div>
        </section>

        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-primary p-2 rounded mt-4"
        >
          Update Password
        </button>
      </form>
    </>
  );
}