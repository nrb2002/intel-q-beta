"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerSchema } from "@/lib/validations/register";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FieldErrors = {
  firstName?: string[];
  lastName?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
};

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    // Clear the field error when the user edits it
    setFieldErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    // Clear general API error
    if (error) {
      setError("");
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setFieldErrors({});

    // Client-side validation
    const parsed = registerSchema.safeParse({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (!parsed.success) {
      const errors =
        parsed.error.flatten().fieldErrors;

      setFieldErrors(errors as FieldErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed.data),
        }
      );

      let data: {
        error?: string;
        fieldErrors?: FieldErrors;
      };

      try {
        data = await response.json();
      } catch {
        setError(
          "The server returned an invalid response. Please try again."
        );
        return;
      }

      if (!response.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }

        setError(
          data.error ||
            "Registration failed. Please try again."
        );

        return;
      }

      // Registration successful
      router.push("/login?registered=true");
    } catch {
      setError(
        "Unable to connect to the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC]";

  function getInputClassName(
    field: keyof FieldErrors
  ) {
    if (fieldErrors[field]) {
      return `${inputClassName} border-red-500 focus:border-red-500 focus:ring-red-500/20`;
    }

    return inputClassName;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] px-4 py-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-lg">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1E293B]">
            Register
          </h1>

          <p className="mt-2 text-sm text-[#64748B]">
            Join Intel-Q and start managing your queue
            experience.
          </p>
        </div>

        {/* General Error */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          {/* First and Last Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-[#1E293B]"
              >
                First name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                aria-describedby="firstName-error"
                aria-invalid={!!fieldErrors.firstName}
                disabled={loading}
                className={getInputClassName(
                  "firstName"
                )}
              />

              <div
                id="firstName-error"
                aria-live="polite"
                className="mt-1 min-h-5 text-sm text-red-600"
              >
                {fieldErrors.firstName?.map(
                  (message) => (
                    <p key={message}>{message}</p>
                  )
                )}
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-[#1E293B]"
              >
                Last name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                aria-describedby="lastName-error"
                aria-invalid={!!fieldErrors.lastName}
                disabled={loading}
                className={getInputClassName(
                  "lastName"
                )}
              />

              <div
                id="lastName-error"
                aria-live="polite"
                className="mt-1 min-h-5 text-sm text-red-600"
              >
                {fieldErrors.lastName?.map(
                  (message) => (
                    <p key={message}>{message}</p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              aria-describedby="email-error"
              aria-invalid={!!fieldErrors.email}
              disabled={loading}
              className={getInputClassName("email")}
            />

            <div
              id="email-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.email?.map(
                (message) => (
                  <p key={message}>{message}</p>
                )
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Password
            </label>

            {/* Input + Eye Button */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                aria-describedby="password-help password-error"
                aria-invalid={!!fieldErrors.password}
                disabled={loading}
                className={`${getInputClassName(
                  "password"
                )} pr-12`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showPassword ? (
                  // Eye off
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.584 10.587a2 2 0 002.829 2.829"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.88 5.09A10.94 10.94 0 0112 4.5c5.5 0 9.5 5.5 9.5 7.5a9.9 9.9 0 01-2.05 3.33"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.61 6.61C4.35 8.1 2.5 10.63 2.5 12c0 2 4 7.5 9.5 7.5a10.9 10.9 0 004.1-.8"
                    />
                  </svg>
                ) : (
                  // Eye
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.5 12s3.5-7.5 9.5-7.5 9.5 7.5 9.5 7.5-3.5 7.5-9.5 7.5S2.5 12 2.5 12z"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />
                  </svg>
                )}
              </button>
            </div>

            <p
              id="password-help"
              className="mt-1 text-xs text-[#64748B]"
            >
              Password must be between 8 and 32
              characters.
            </p>

            <div
              id="password-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.password?.map(
                (message) => (
                  <p key={message}>{message}</p>
                )
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Confirm password
            </label>

            {/* Input + Eye Button */}
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                aria-describedby="confirmPassword-error"
                aria-invalid={
                  !!fieldErrors.confirmPassword
                }
                disabled={loading}
                className={`${getInputClassName(
                  "confirmPassword"
                )} pr-12`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                disabled={loading}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.584 10.587a2 2 0 002.829 2.829"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.88 5.09A10.94 10.94 0 0112 4.5c5.5 0 9.5 5.5 9.5 7.5a9.9 9.9 0 01-2.05 3.33"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.61 6.61C4.35 8.1 2.5 10.63 2.5 12c0 2 4 7.5 9.5 7.5a10.9 10.9 0 004.1-.8"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.5 12s3.5-7.5 9.5-7.5 9.5 7.5 9.5 7.5-3.5 7.5-9.5 7.5S2.5 12 2.5 12z"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div
              id="confirmPassword-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.confirmPassword?.map(
                (message) => (
                  <p key={message}>{message}</p>
                )
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full rounded-lg bg-[#2563EB] px-4 py-3 font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-[#64748B]">
          Already have an account?{" "}

          <Link
            href="/login"
            className="font-semibold text-[#2563EB] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}