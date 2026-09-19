import { api } from "./axios";
import { tokenStore } from "../lib/tokenStore";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/token/", payload);
  tokenStore.set(data.access, data.refresh);
  return data;
}

export async function register(payload: RegisterPayload): Promise<{ username: string }> {
  const { data } = await api.post<{ username: string }>("/register/", payload);
  return data;
}

export function logout() {
  tokenStore.clear();
}

export function isAuthenticated(): boolean {
  return Boolean(tokenStore.getAccess());
}
