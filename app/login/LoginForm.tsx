'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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

    setError("Falsche E-Mail oder Passwort.");
  };

  return (
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
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-400">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="p-3 rounded bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-colors"
      >
        Login
      </button>
    </form>
  );
}