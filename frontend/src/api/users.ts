import { api } from "./axios";
import type { Profile, ProfilePayload, User } from "../types";

export async function fetchProfile(): Promise<Profile> {
  const { data } = await api.get<Profile>("/profile/");
  return data;
}

export async function updateProfile(payload: ProfilePayload): Promise<Profile> {
  const { data } = await api.patch<Profile>("/profile/", payload);
  return data;
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<User[] | { results: User[] }>("/users/");
  return Array.isArray(data) ? data : data.results;
}
