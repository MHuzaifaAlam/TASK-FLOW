import { createContext, useContext, useState, type ReactNode } from "react";
import { login as loginRequest, logout as logoutRequest, isAuthenticated } from "../api/auth";
import { extractErrorMessage } from "../api/axios";

interface AuthContextValue {
  isAuthed: boolean;
  isLoggingIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(isAuthenticated());
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function login(username: string, password: string) {
    setIsLoggingIn(true);
    try {
      await loginRequest({ username, password });
      setIsAuthed(true);
    } catch (err) {
      throw new Error(extractErrorMessage(err) === "Something went wrong. Please try again."
        ? "Incorrect username or password."
        : extractErrorMessage(err));
    } finally {
      setIsLoggingIn(false);
    }
  }

  function logout() {
    logoutRequest();
    setIsAuthed(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthed, isLoggingIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
