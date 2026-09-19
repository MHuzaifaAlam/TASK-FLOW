import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AppShell } from "../components/layout/AppShell";
import { PageLoader } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { ProjectCard } from "../components/projects/ProjectCard";
import { ProjectFormModal } from "../components/projects/ProjectFormModal";
import { createProject, fetchProjects } from "../api/projects";
import { extractErrorMessage, extractFieldErrors } from "../api/axios";
import type { ApiFieldErrors, Project, ProjectPayload, ProjectStatus } from "../types";

const statusFilters: Array<{ value: ProjectStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors | null>(null);
  const [formGeneralError, setFormGeneralError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchProjects();
      setProjects(Array.isArray(result) ? result : result.results);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setFieldErrors(null);
    setFormGeneralError(null);
    setIsFormOpen(true);
  }

  async function handleCreate(payload: ProjectPayload) {
    setIsSubmitting(true);
    setFieldErrors(null);
    setFormGeneralError(null);
    try {
      await createProject(payload);
      toast.success("Project created.");
      setIsFormOpen(false);
      await load();
    } catch (err) {
      const errors = extractFieldErrors(err);
      if (errors) setFieldErrors(errors);
      else setFormGeneralError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  const filtered = useMemo(
    () => (statusFilter === "all" ? projects : projects.filter((p) => p.status === statusFilter)),
    [projects, statusFilter]
  );

  return (
    <AppShell title="Projects">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-400">Projects you own or contribute to.</p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 rounded-md border border-line bg-white p-1">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                    statusFilter === f.value ? "bg-ink-900 text-white" : "text-ink-500 hover:bg-ink-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button className="btn-primary" onClick={openCreate}>
              New project
            </button>
          </div>
        </div>

        {isLoading && <PageLoader />}
        {!isLoading && error && <ErrorState message={error} onRetry={load} />}
        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState title="No projects here" description="Try a different status filter." />
        )}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
      {isFormOpen && (
        <ProjectFormModal
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
          generalError={formGeneralError}
          onSubmit={handleCreate}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </AppShell>
  );
}
