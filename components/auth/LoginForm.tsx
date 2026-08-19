// components/auth/LoginForm.tsx

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import {
  getSession,
  signIn,
} from "next-auth/react";

import { loginSchema } from "@/lib/validations/login";

type LoginRole = "STAFF" | "ADMIN";

type LoginFormProps = {
  expectedRole: LoginRole;
};

type FieldErrors = {
  email?: string[];
  password?: string[];
};

export default function LoginForm({
  expectedRole,
}: LoginFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isAdminLogin = expectedRole === "ADMIN";

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
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
          .fieldErrors as FieldErrors,
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

      /*
       * Retrieve the newly created session and verify
       * the user's role before redirecting.
       */
      const session = await getSession();

      const userRole = session?.user?.role;

      /*
       * ADMIN can access the staff operational area,
       * but the admin login endpoint is restricted to
       * ADMIN users.
       */
      if (
        expectedRole === "ADMIN" &&
        userRole !== "ADMIN"
      ) {
        setError(
          "This account does not have administrator access.",
        );

        return;
      }

      /*
       * Staff login accepts STAFF and ADMIN accounts.
       */
      if (
        expectedRole === "STAFF" &&
        userRole !== "STAFF" &&
        userRole !== "ADMIN"
      ) {
        setError(
          "This account does not have staff access.",
        );

        return;
      }

      router.push(
        expectedRole === "ADMIN"
          ? "/admin"
          : "/staff",
      );

      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC]";

  function getInputClassName(
    field: keyof FieldErrors,
  ) {
    if (fieldErrors[field]) {
      return `${inputClassName} border-red-500 focus:border-red-500 focus:ring-red-500/20`;
    }

    return inputClassName;
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-[#2563EB]">
            {isAdminLogin
              ? "Administrator Access"
              : "Staff Access"}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#1E293B]">
            {isAdminLogin
              ? "Admins"
              : "Staff Members"}
          </h1>

          <p className="mt-2 text-sm text-[#64748B]">
            {isAdminLogin
              ? "Sign in to manage Intel-Q administration."
              : "Sign in to manage customer queues."}
          </p>
        </div>

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

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#1E293B]"
            >
              Password
            </label>

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
                  "password",
                )} pr-12`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
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
                {showPassword ? "Hide" : "Show"}
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
      </div>
    </div>
  );
}