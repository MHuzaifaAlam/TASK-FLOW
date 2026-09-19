import { api } from "./axios";
import type { Paginated, Project, ProjectPayload } from "../types";

export async function fetchProjects(params: Record<string, unknown> = {}): Promise<Paginated<Project> | Project[]> {
  const { data } = await api.get<Paginated<Project> | Project[]>("/projects/", { params });
  return data;
}

export async function fetchProject(id: number): Promise<Project> {
  const { data } = await api.get<Project>(`/projects/${id}/`);
  return data;
}

export async function createProject(payload: ProjectPayload): Promise<Project> {
  const { data } = await api.post<Project>("/projects/", payload);
  return data;
}
