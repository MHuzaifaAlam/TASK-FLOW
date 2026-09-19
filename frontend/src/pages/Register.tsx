import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { extractErrorMessage, extractFieldErrors } from "../api/axios";
import type { ApiFieldErrors } from "../types";

export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFieldErrors({});
    setError(null);

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: ["Passwords do not match."] });
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ username: username.trim(), password });
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      const errors = extractFieldErrors(err);
      if (errors) setFieldErrors(errors);
      else setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-500 font-display text-lg font-bold text-white">
            T
          </div>
          <div className="text-center">
            <h1 className="font-display text-xl font-semibold text-white">Create your TaskFlow account</h1>
            <p className="mt-1 text-sm text-ink-300">Your profile will be ready to complete after registration.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6" noValidate>
          <div className="mb-4">
            <label htmlFor="register-username" className="label">Username</label>
            <input
              id="register-username"
              className="input"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoFocus
            />
            {fieldErrors.username && <p className="field-error">{fieldErrors.username[0]}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="register-password" className="label">Password</label>
            <input
              id="register-password"
              type="password"
              className="input"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password[0]}</p>}
          </div>

          <div>
            <label htmlFor="register-confirm-password" className="label">Confirm password</label>
            <input
              id="register-confirm-password"
              type="password"
              className="input"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {fieldErrors.confirmPassword && <p className="field-error">{fieldErrors.confirmPassword[0]}</p>}
          </div>

          {error && <p role="alert" className="field-error mt-2">{error}</p>}

          <button type="submit" className="btn-primary mt-5 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
          <p className="mt-4 text-center text-sm text-ink-400">
            Already have an account? <Link className="font-medium text-teal-600 hover:text-teal-700" to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
