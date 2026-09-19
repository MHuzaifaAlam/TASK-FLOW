import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AppShell } from "../components/layout/AppShell";
import { PageLoader } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { Badge } from "../components/ui/Badge";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { TaskFormModal } from "../components/tasks/TaskFormModal";
import { deleteTask, fetchTask, updateTask } from "../api/tasks";
import { fetchProjects } from "../api/projects";
import { fetchUsers } from "../api/users";
import { extractErrorMessage, extractFieldErrors } from "../api/axios";
import type { ApiFieldErrors, Project, Task, TaskPayload, User } from "../types";

export function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors | null>(null);
  const [formGeneralError, setFormGeneralError] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function load() {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchTask(Number(id));
      setTask(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    fetchProjects()
      .then((res) => setProjects(Array.isArray(res) ? res : res.results))
      .catch(() => {});
    fetchUsers()
      .then(setUsers)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleEditSubmit(payload: TaskPayload) {
    if (!task) return;
    setIsSubmitting(true);
    setFieldErrors(null);
    setFormGeneralError(null);
    try {
      const updated = await updateTask(task.id, payload);
      setTask(updated);
      toast.success("Task updated.");
      setIsEditing(false);
    } catch (err) {
      const errors = extractFieldErrors(err);
      if (errors) setFieldErrors(errors);
      else setFormGeneralError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!task) return;
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted.");
      navigate("/tasks");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AppShell title="Task details">
      <Link to="/tasks" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-teal-600">
        ← Back to tasks
      </Link>

      {isLoading && <PageLoader />}
      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && task && (
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-900">{task.title}</h2>
              <p className="mt-1 text-sm text-ink-400">
                In <span className="font-medium text-ink-600">{task.project.title}</span> · Created{" "}
                {new Date(task.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button className="btn-danger" onClick={() => setIsConfirmingDelete(true)}>
                Delete
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Description</h3>
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink-700">
                {task.description || <span className="text-ink-300">No description provided.</span>}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Assigned users</h3>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {task.assigned_to.length === 0 ? (
                  <span className="text-sm text-ink-300">Unassigned</span>
                ) : (
                  task.assigned_to.map((u) => (
                    <Badge key={u.id} tone="ink">
                      {u.username}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Estimated hours</h3>
              <p className="mt-1.5 text-sm text-ink-700">{task.estimated_hours}h</p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Actual hours</h3>
              <p className="mt-1.5 text-sm text-ink-700">{task.actual_hours}h</p>
            </div>
          </div>
        </div>
      )}

      {isEditing && task && (
        <TaskFormModal
          mode="edit"
          initialTask={task}
          projects={projects}
          users={users}
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
          generalError={formGeneralError}
          onSubmit={handleEditSubmit}
          onClose={() => setIsEditing(false)}
        />
      )}

      {isConfirmingDelete && task && (
        <ConfirmDialog
          title="Delete task"
          message={`Delete "${task.title}"? This can't be undone.`}
          confirmLabel="Delete"
          isLoading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
    </AppShell>
  );
}
