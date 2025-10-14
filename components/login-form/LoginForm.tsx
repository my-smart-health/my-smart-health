'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import StatusModal from "../modals/status-modal/StatusModal";
import { ErrorState } from "@/utils/types";

export default function LoginForm() {
  const router = useRouter();
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
      router.push("/dashboard");
      router.refresh();
      return response;
    }

    setError({ type: "error", message: "Falsche E-Mail oder Passwort." });
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
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
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

        <button
          type="submit"
          className="p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors"
        >
          Login
        </button>
      </form>
    </>
  );
}