import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "../ui/Modal";
import type { ApiFieldErrors, Project, Task, TaskPayload, User } from "../../types";

interface TaskFormModalProps {
  mode: "create" | "edit";
  initialTask?: Task;
  projects: Project[];
  users: User[];
  isSubmitting: boolean;
  fieldErrors: ApiFieldErrors | null;
  generalError: string | null;
  onSubmit: (payload: TaskPayload) => void;
  onClose: () => void;
}

function validate(payload: TaskPayload): ApiFieldErrors {
  const errors: ApiFieldErrors = {};
  if (payload.title.trim().length < 5) {
    errors.title = ["Title must be at least 5 characters."];
  }
  if (!payload.project_id) {
    errors.project_id = ["Choose a project."];
  }
  if (payload.estimated_hours === 0) {
    errors.estimated_hours = ["Estimated hours cannot be zero."];
  }
  if (payload.actual_hours > payload.estimated_hours) {
    errors.actual_hours = ["Actual hours cannot exceed estimated hours."];
  }
  return errors;
}

export function TaskFormModal({
  mode,
  initialTask,
  projects,
  users,
  isSubmitting,
  fieldErrors,
  generalError,
  onSubmit,
  onClose,
}: TaskFormModalProps) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [projectId, setProjectId] = useState<number | "">(initialTask?.project.id ?? "");
  const [assignedIds, setAssignedIds] = useState<number[]>(initialTask?.assigned_to.map((u) => u.id) ?? []);
  const [estimatedHours, setEstimatedHours] = useState(initialTask ? String(initialTask.estimated_hours) : "");
  const [actualHours, setActualHours] = useState(initialTask ? String(initialTask.actual_hours) : "0");
  const [localErrors, setLocalErrors] = useState<ApiFieldErrors>({});

  useEffect(() => {
    if (mode === "create" && projects.length && projectId === "") {
      setProjectId(projects[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  const errors: ApiFieldErrors = { ...localErrors, ...(fieldErrors ?? {}) };

  function toggleAssignee(id: number) {
    setAssignedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload: TaskPayload = {
      title: title.trim(),
      description: description.trim(),
      project_id: projectId === "" ? 0 : projectId,
      assigned_to_ids: assignedIds,
      estimated_hours: Number(estimatedHours) || 0,
      actual_hours: Number(actualHours) || 0,
    };
    const validation = validate(payload);
    setLocalErrors(validation);
    if (Object.keys(validation).length > 0) return;
    onSubmit(payload);
  }

  return (
    <Modal title={mode === "create" ? "Create task" : "Edit task"} onClose={onClose} widthClass="max-w-xl">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {generalError && (
          <p role="alert" className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">
            {generalError}
          </p>
        )}

        <div>
          <label className="label" htmlFor="task-title">
            Title
          </label>
          <input id="task-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          {errors.title && <p className="field-error">{errors.title[0]}</p>}
        </div>

        <div>
          <label className="label" htmlFor="task-description">
            Description
          </label>
          <textarea
            id="task-description"
            className="input min-h-[90px] resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <p className="field-error">{errors.description[0]}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="task-project">
              Project
            </label>
            <select
              id="task-project"
              className="input"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            {errors.project_id && <p className="field-error">{errors.project_id[0]}</p>}
          </div>

          <div>
            <span className="label">Assigned users</span>
            <div className="max-h-28 space-y-1.5 overflow-y-auto rounded-md border border-line px-3 py-2">
              {users.length === 0 && <p className="text-xs text-ink-400">No users available.</p>}
              {users.map((u) => (
                <label key={u.id} className="flex items-center gap-2 text-sm text-ink-700">
                  <input
                    type="checkbox"
                    checked={assignedIds.includes(u.id)}
                    onChange={() => toggleAssignee(u.id)}
                    className="h-3.5 w-3.5 rounded border-line text-teal-500 focus:ring-teal-500"
                  />
                  {u.username}
                </label>
              ))}
            </div>
            {errors.assigned_to_ids && <p className="field-error">{errors.assigned_to_ids[0]}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="estimated-hours">
              Estimated hours
            </label>
            <input
              id="estimated-hours"
              type="number"
              min={0}
              className="input"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
            />
            {errors.estimated_hours && <p className="field-error">{errors.estimated_hours[0]}</p>}
          </div>
          <div>
            <label className="label" htmlFor="actual-hours">
              Actual hours
            </label>
            <input
              id="actual-hours"
              type="number"
              min={0}
              className="input"
              value={actualHours}
              onChange={(e) => setActualHours(e.target.value)}
            />
            {errors.actual_hours && <p className="field-error">{errors.actual_hours[0]}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : mode === "create" ? "Create task" : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
