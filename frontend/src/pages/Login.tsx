import { type FormEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string })?.from || "/";
  const registered = (location.state as { registered?: boolean })?.registered;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign in.");
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
            <h1 className="font-display text-xl font-semibold text-white">TaskFlow</h1>
            <p className="mt-1 text-sm text-ink-300">Sign in to manage your tasks and projects.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6" noValidate>
          <div className="mb-4">
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="field-error mb-2">
              {error}
            </p>
          )}
          {registered && !error && (
            <p className="mb-2 text-sm text-teal-600">Account created. Sign in to complete your profile.</p>
          )}

          <button type="submit" className="btn-primary mt-4 w-full" disabled={isLoggingIn}>
            {isLoggingIn ? "Signing in…" : "Sign in"}
          </button>
          <p className="mt-4 text-center text-sm text-ink-400">
            New user? <a className="font-medium text-teal-600 hover:text-teal-700" href="/register">Create a profile</a>
          </p>
        </form>
      </div>
    </div>
  );
}
