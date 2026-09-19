import { useState, type FormEvent } from "react";
import { Modal } from "../ui/Modal";
import type { ApiFieldErrors, ProjectPayload, ProjectStatus } from "../../types";

interface ProjectFormModalProps {
  isSubmitting: boolean;
  fieldErrors: ApiFieldErrors | null;
  generalError: string | null;
  onSubmit: (payload: ProjectPayload) => void;
  onClose: () => void;
}

export function ProjectFormModal({
  isSubmitting,
  fieldErrors,
  generalError,
  onSubmit,
  onClose,
}: ProjectFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("active");
  const [localErrors, setLocalErrors] = useState<ApiFieldErrors>({});
  const errors: ApiFieldErrors = { ...localErrors, ...(fieldErrors ?? {}) };

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const payload: ProjectPayload = {
      title: title.trim(),
      description: description.trim(),
      status,
    };
    const validation: ApiFieldErrors = {};
    if (!payload.title) validation.title = ["Title is required."];
    setLocalErrors(validation);
    if (Object.keys(validation).length > 0) return;
    onSubmit(payload);
  }

  return (
    <Modal title="Create project" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {generalError && (
          <p role="alert" className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">
            {generalError}
          </p>
        )}

        <div>
          <label className="label" htmlFor="project-title">
            Title
          </label>
          <input
            id="project-title"
            className="input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
          />
          {errors.title && <p className="field-error">{errors.title[0]}</p>}
        </div>

        <div>
          <label className="label" htmlFor="project-description">
            Description
          </label>
          <textarea
            id="project-description"
            className="input min-h-[110px] resize-y"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {errors.description && <p className="field-error">{errors.description[0]}</p>}
        </div>

        <div>
          <label className="label" htmlFor="project-status">
            Status
          </label>
          <select
            id="project-status"
            className="input"
            value={status}
            onChange={(event) => setStatus(event.target.value as ProjectStatus)}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          {errors.status && <p className="field-error">{errors.status[0]}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
