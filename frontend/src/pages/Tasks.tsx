import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AppShell } from "../components/layout/AppShell";
import { PageLoader } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { Pagination } from "../components/ui/Pagination";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { TaskTable } from "../components/tasks/TaskTable";
import { TaskFormModal } from "../components/tasks/TaskFormModal";
import { useDebounce } from "../hooks/useDebounce";
import { createTask, deleteTask, fetchTasks, updateTask } from "../api/tasks";
import { fetchProjects } from "../api/projects";
import { fetchUsers } from "../api/users";
import { extractErrorMessage, extractFieldErrors } from "../api/axios";
import type { ApiFieldErrors, Paginated, Project, Task, TaskPayload, User } from "../types";

const PAGE_SIZE = 2;

export function Tasks() {
  const [data, setData] = useState<Paginated<Task> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [projectId, setProjectId] = useState<number | "">("");
  const [minHours, setMinHours] = useState("");
  const [maxHours, setMaxHours] = useState("");
  const debouncedMin = useDebounce(minHours);
  const debouncedMax = useDebounce(maxHours);
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);

  const [formState, setFormState] = useState<{ mode: "create" | "edit"; task?: Task } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors | null>(null);
  const [formGeneralError, setFormGeneralError] = useState<string | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProjects()
      .then((res) => setProjects(Array.isArray(res) ? res : res.results))
      .catch(() => {});
    fetchUsers()
      .then(setUsers)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, projectId, debouncedMin, debouncedMax, ordering]);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchTasks({
        search: debouncedSearch || undefined,
        project: projectId || undefined,
        min_hours: debouncedMin ? Number(debouncedMin) : undefined,
        max_hours: debouncedMax ? Number(debouncedMax) : undefined,
        ordering,
        page,
      });
      setData(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, projectId, debouncedMin, debouncedMax, ordering, page]);

  function clearFilters() {
    setSearch("");
    setProjectId("");
    setMinHours("");
    setMaxHours("");
    setOrdering("-created_at");
  }

  function openCreate() {
    setFieldErrors(null);
    setFormGeneralError(null);
    setFormState({ mode: "create" });
  }

  function openEdit(task: Task) {
    setFieldErrors(null);
    setFormGeneralError(null);
    setFormState({ mode: "edit", task });
  }

  async function handleFormSubmit(payload: TaskPayload) {
    if (!formState) return;
    setIsSubmitting(true);
    setFieldErrors(null);
    setFormGeneralError(null);
    try {
      if (formState.mode === "create") {
        await createTask(payload);
        toast.success("Task created.");
      } else if (formState.task) {
        await updateTask(formState.task.id, payload);
        toast.success("Task updated.");
      }
      setFormState(null);
      load();
    } catch (err) {
      const errors = extractFieldErrors(err);
      if (errors) setFieldErrors(errors);
      else setFormGeneralError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      toast.success("Task deleted.");
      setTaskToDelete(null);
      if (data && data.results.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        load();
      }
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AppShell title="Tasks">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-400">Tasks assigned to you across all projects.</p>
          <button className="btn-primary" onClick={openCreate}>
            New task
          </button>
        </div>

        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          projectId={projectId}
          onProjectChange={setProjectId}
          minHours={minHours}
          onMinHoursChange={setMinHours}
          maxHours={maxHours}
          onMaxHoursChange={setMaxHours}
          ordering={ordering}
          onOrderingChange={setOrdering}
          projects={projects}
          onClear={clearFilters}
        />

        <div className="card overflow-hidden">
          {isLoading && <PageLoader />}
          {!isLoading && error && <ErrorState message={error} onRetry={load} />}
          {!isLoading && !error && data && data.results.length === 0 && (
            <div className="p-4">
              <EmptyState
                title="No tasks match your filters"
                description="Try clearing filters or search terms, or create a new task."
                action={
                  <button className="btn-secondary" onClick={clearFilters}>
                    Clear filters
                  </button>
                }
              />
            </div>
          )}
          {!isLoading && !error && data && data.results.length > 0 && (
            <>
              <TaskTable tasks={data.results} onEdit={openEdit} onDelete={setTaskToDelete} />
              <Pagination
                count={data.count}
                pageSize={PAGE_SIZE}
                page={page}
                hasNext={Boolean(data.next)}
                hasPrevious={Boolean(data.previous)}
                onNext={() => setPage((p) => p + 1)}
                onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              />
            </>
          )}
        </div>
      </div>

      {formState && (
        <TaskFormModal
          mode={formState.mode}
          initialTask={formState.task}
          projects={projects}
          users={users}
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
          generalError={formGeneralError}
          onSubmit={handleFormSubmit}
          onClose={() => setFormState(null)}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          title="Delete task"
          message={`Delete "${taskToDelete.title}"? This can't be undone.`}
          confirmLabel="Delete"
          isLoading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </AppShell>
  );
}
