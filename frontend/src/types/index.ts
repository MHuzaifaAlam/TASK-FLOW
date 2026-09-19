export interface User {
  id: number;
  username: string;
}

export type ProjectStatus = "active" | "completed" | "archived";

export interface Project {
  id: number;
  title: string;
  description: string;
  owner: User;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface ProjectPayload {
  title: string;
  description: string;
  status: ProjectStatus;
}

export interface ProjectRef {
  id: number;
  title: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  project: ProjectRef;
  assigned_to: User[];
  created_at: string;
  estimated_hours: number;
  actual_hours: number;
}

export interface TaskPayload {
  title: string;
  description: string;
  project_id: number;
  assigned_to_ids: number[];
  estimated_hours: number;
  actual_hours: number;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Profile {
  username: string;
  bio: string;
  phone_number: string;
}

export interface ProfilePayload {
  bio: string;
  phone_number: string;
}

export interface TaskQueryParams {
  search?: string;
  project?: number;
  min_hours?: number;
  max_hours?: number;
  ordering?: string;
  page?: number;
}

/** Field-level validation errors as returned by DRF, e.g. { title: ["..."] } */
export type ApiFieldErrors = Record<string, string[]>;
