import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import type { Task } from "../../types";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-400">
            <th className="px-4 py-3 font-medium normal-case">Task</th>
            <th className="px-4 py-3 font-medium normal-case">Project</th>
            <th className="px-4 py-3 font-medium normal-case">Assigned</th>
            <th className="px-4 py-3 font-medium normal-case">Hours</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b border-line last:border-0 hover:bg-ink-50/60">
              <td className="px-4 py-3">
                <Link to={`/tasks/${task.id}`} className="font-medium text-ink-900 hover:text-teal-600">
                  {task.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-ink-500">{task.project.title}</td>
              <td className="px-4 py-3">
                {task.assigned_to.length === 0 ? (
                  <span className="text-ink-300">Unassigned</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {task.assigned_to.slice(0, 3).map((u) => (
                      <Badge key={u.id} tone="ink">
                        {u.username}
                      </Badge>
                    ))}
                    {task.assigned_to.length > 3 && <Badge tone="ink">+{task.assigned_to.length - 3}</Badge>}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-ink-500">
                {task.actual_hours}/{task.estimated_hours}h
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button className="btn-ghost px-2 py-1 text-xs" onClick={() => onEdit(task)}>
                    Edit
                  </button>
                  <button
                    className="btn-ghost px-2 py-1 text-xs text-danger-500 hover:bg-danger-50"
                    onClick={() => onDelete(task)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
