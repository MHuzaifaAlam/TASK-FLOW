import { api } from "./axios";
import type { Paginated, Task, TaskPayload, TaskQueryParams } from "../types";

export async function fetchTasks(params: TaskQueryParams = {}): Promise<Paginated<Task>> {
  const { data } = await api.get<Paginated<Task>>("/tasks/", { params });
  return data;
}

export async function fetchTasksByUrl(url: string): Promise<Paginated<Task>> {
  // DRF pagination returns an absolute backend URL; use the Vite proxy in development.
  const parsedUrl = new URL(url, window.location.origin);
  const apiPath = parsedUrl.pathname.replace(/^\/api(?=\/|$)/, "");
  const apiUrl = `${apiPath}${parsedUrl.search}`;
  const { data } = await api.get<Paginated<Task>>(apiUrl);
  return data;
}

export async function fetchTask(id: number): Promise<Task> {
  const { data } = await api.get<Task>(`/tasks/${id}/`);
  return data;
}

export async function createTask(payload: TaskPayload): Promise<Task> {
  const { data } = await api.post<Task>("/tasks/", payload);
  return data;
}

export async function updateTask(id: number, payload: Partial<TaskPayload>): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}/`, payload);
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}/`);
}
