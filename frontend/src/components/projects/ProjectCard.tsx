import { Badge } from "../ui/Badge";
import type { Project, ProjectStatus } from "../../types";

const statusTone: Record<ProjectStatus, "teal" | "success" | "ink"> = {
  active: "teal",
  completed: "success",
  archived: "ink",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-ink-900">{project.title}</h3>
        <Badge tone={statusTone[project.status]}>{project.status}</Badge>
      </div>
      <p className="mt-2 flex-1 text-sm text-ink-500">
        {project.description || <span className="text-ink-300">No description.</span>}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-ink-400">
        <span>Owner: {project.owner.username}</span>
        <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
