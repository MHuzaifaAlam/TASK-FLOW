import type { Project, TaskQueryParams } from "../../types";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  projectId: number | "";
  onProjectChange: (value: number | "") => void;
  minHours: string;
  onMinHoursChange: (value: string) => void;
  maxHours: string;
  onMaxHoursChange: (value: string) => void;
  ordering: TaskQueryParams["ordering"];
  onOrderingChange: (value: string) => void;
  projects: Project[];
  onClear: () => void;
}

const orderingOptions = [
  { value: "-created_at", label: "Newest first" },
  { value: "created_at", label: "Oldest first" },
  { value: "title", label: "Title (A–Z)" },
  { value: "-title", label: "Title (Z–A)" },
  { value: "estimated_hours", label: "Estimated hours (low–high)" },
  { value: "-estimated_hours", label: "Estimated hours (high–low)" },
];

export function TaskFilters({
  search,
  onSearchChange,
  projectId,
  onProjectChange,
  minHours,
  onMinHoursChange,
  maxHours,
  onMaxHoursChange,
  ordering,
  onOrderingChange,
  projects,
  onClear,
}: TaskFiltersProps) {
  const hasActiveFilters = Boolean(search || projectId || minHours || maxHours || (ordering && ordering !== "-created_at"));

  return (
    <div className="card p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <label className="label" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            className="input"
            placeholder="Search title or description"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="project-filter">
            Project
          </label>
          <select
            id="project-filter"
            className="input"
            value={projectId}
            onChange={(e) => onProjectChange(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="min-hours">
            Min hours
          </label>
          <input
            id="min-hours"
            type="number"
            min={0}
            className="input"
            value={minHours}
            onChange={(e) => onMinHoursChange(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="max-hours">
            Max hours
          </label>
          <input
            id="max-hours"
            type="number"
            min={0}
            className="input"
            value={maxHours}
            onChange={(e) => onMaxHoursChange(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="ordering">
            Sort by
          </label>
          <select id="ordering" className="input" value={ordering} onChange={(e) => onOrderingChange(e.target.value)}>
            {orderingOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex justify-end">
          <button className="btn-ghost px-2 py-1 text-xs" onClick={onClear}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
