"use client";

import { useState } from "react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function PasswordInput({
  error = false,
  className = "",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        aria-invalid={error}
        className={`w-full rounded-lg border bg-white px-4 py-3 pr-12 text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 ${
          error
            ? "border-red-400"
            : "border-[#CBD5E1]"
        } ${className}`}
      />

      <button
        type="button"
        onClick={() =>
          setShowPassword((previous) => !previous)
        }
        aria-label={
          showPassword
            ? "Hide password"
            : "Show password"
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
      >
        {showPassword ? (
          // Eye slash
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 15.658 7.027 18 12 18c.63 0 1.244-.05 1.83-.147M6.228 6.228A10.451 10.451 0 0 1 12 4c4.973 0 8.774 2.342 10.066 6a10.49 10.49 0 0 1-1.57 2.648m-4.342 2.43A10.45 10.45 0 0 1 12 20c-4.973 0-8.774-2.342-10.066-6a10.49 10.49 0 0 1 1.57-2.648m0 0L3 3m3.228 3.228L21 21"
            />
          </svg>
        ) : (
          // Eye
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5s8.577 3.01 9.964 7.178a1.012 1.012 0 0 1 0 .644C20.577 16.49 16.64 19.5 12 19.5s-8.577-3.01-9.964-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}