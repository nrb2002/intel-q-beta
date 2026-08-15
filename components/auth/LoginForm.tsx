// components/auth/LoginForm.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { loginSchema } from "@/lib/validations/login";

type FieldErrors = {
  email?: string[];
  password?: string[];
};

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  // Controls whether the password is visible.
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    // Clear the field error when the user starts correcting it.
    setFieldErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    // Clear the general error.
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

    const parsed = loginSchema.safeParse({
      email: formData.email,
      password: formData.password,
    });

    if (!parsed.success) {
      setFieldErrors(
        parsed.error.flatten()
          .fieldErrors as FieldErrors
      );

      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to sign in. Please try again."
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
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-lg">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1E293B]">
            Login
          </h1>

          <p className="mt-2 text-sm text-[#64748B]">
            Sign in with your credentials to manage
            queues.
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
              placeholder="you@example.com"
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
              {fieldErrors.email?.map((message) => (
                <p key={message}>{message}</p>
              ))}
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

            {/* Password input + eye button */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-describedby="password-error"
                aria-invalid={!!fieldErrors.password}
                disabled={loading}
                className={`${getInputClassName(
                  "password"
                )} pr-12`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showPassword ? (
                  /* Eye-off icon */
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
                      d="M9.88 4.24A9.77 9.77 0 0112 4c5 0 8.27 4.11 9 8-.25 1.31-.79 2.54-1.53 3.6M6.61 6.61C4.85 7.83 3.7 9.63 3 12c.73 3.89 4 8 9 8 1.61 0 3.08-.41 4.38-1.11"
                    />
                  </svg>
                ) : (
                  /* Eye icon */
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
                      d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
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
              id="password-error"
              aria-live="polite"
              className="mt-1 min-h-5 text-sm text-red-600"
            >
              {fieldErrors.password?.map((message) => (
                <p key={message}>{message}</p>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full rounded-lg bg-[#2563EB] px-4 py-3 font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-[#64748B]">
          Don&apos;t have an account?{" "}

          <Link
            href="/register"
            className="font-semibold text-[#2563EB] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}