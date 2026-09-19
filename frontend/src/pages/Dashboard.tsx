import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { PageLoader } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { fetchTasks, fetchTasksByUrl } from "../api/tasks";
import { fetchProjects } from "../api/projects";
import { extractErrorMessage } from "../api/axios";
import type { Project, Task } from "../types";

interface Stats {
  totalTasks: number;
  activeProjectTasks: number;
  completedProjectTasks: number;
  totalProjects: number;
  estimatedHours: number;
  actualHours: number;
}

const MAX_PAGES_TO_AGGREGATE = 15; // guards against hammering a throttled backend

async function loadAllTasks(): Promise<{ tasks: Task[]; truncated: boolean }> {
  const first = await fetchTasks({ ordering: "-created_at" });
  const tasks: Task[] = [...first.results];
  let next = first.next;
  let pages = 1;
  while (next && pages < MAX_PAGES_TO_AGGREGATE) {
    const page = await fetchTasksByUrl(next);
    tasks.push(...page.results);
    next = page.next;
    pages += 1;
  }
  return { tasks, truncated: Boolean(next) };
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const [{ tasks, truncated: wasTruncated }, projectsData] = await Promise.all([
        loadAllTasks(),
        fetchProjects(),
      ]);
      const projects: Project[] = Array.isArray(projectsData) ? projectsData : projectsData.results;
      const projectStatusById = new Map(projects.map((p) => [p.id, p.status]));

      const estimatedHours = tasks.reduce((sum, t) => sum + t.estimated_hours, 0);
      const actualHours = tasks.reduce((sum, t) => sum + t.actual_hours, 0);
      const activeProjectTasks = tasks.filter((t) => projectStatusById.get(t.project.id) === "active").length;
      const completedProjectTasks = tasks.filter((t) => projectStatusById.get(t.project.id) === "completed").length;

      setStats({
        totalTasks: tasks.length,
        activeProjectTasks,
        completedProjectTasks,
        totalProjects: projects.length,
        estimatedHours,
        actualHours,
      });
      setTruncated(wasTruncated);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppShell title="Dashboard">
      {isLoading && <PageLoader label="Loading your dashboard…" />}
      {!isLoading && error && <ErrorState message={error} onRetry={load} />}
      {!isLoading && !error && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Total tasks" value={stats.totalTasks} />
            <StatCard label="Active-project tasks" value={stats.activeProjectTasks} tone="teal" />
            <StatCard label="Completed-project tasks" value={stats.completedProjectTasks} tone="success" />
            <StatCard label="Projects" value={stats.totalProjects} />
            <StatCard label="Estimated hours" value={stats.estimatedHours} tone="amber" />
            <StatCard label="Actual hours" value={stats.actualHours} />
          </div>

          {truncated && (
            <p className="text-xs text-ink-400">
              Showing totals from the first {MAX_PAGES_TO_AGGREGATE} pages of tasks to avoid excessive API calls.
            </p>
          )}

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-ink-800">Jump back in</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link to="/tasks" className="btn-secondary">
                View all tasks
              </Link>
              <Link to="/projects" className="btn-secondary">
                View projects
              </Link>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone?: "teal" | "amber" | "success" }) {
  const accentClass =
    tone === "teal" ? "text-teal-500" : tone === "amber" ? "text-amber-500" : tone === "success" ? "text-success-500" : "text-ink-900";
  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-ink-400">{label}</p>
      <p className={`mt-1.5 font-display text-2xl font-semibold ${accentClass}`}>{value}</p>
    </div>
  );
}
