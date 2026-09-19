import { NavLink } from "react-router-dom";
import { IconGrid, IconCheck, IconFolder, IconUser, IconLogout } from "./icons";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: IconGrid, end: true },
  { to: "/tasks", label: "Tasks", icon: IconCheck, end: false },
  { to: "/projects", label: "Projects", icon: IconFolder, end: false },
  { to: "/profile", label: "Profile", icon: IconUser, end: false },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col bg-ink-900 text-ink-200">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-500 font-display text-sm font-bold text-white">
          T
        </div>
        <span className="font-display text-base font-semibold text-white">TaskFlow</span>
      </div>

      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-ink-800 text-white border-l-2 border-teal-400 -ml-px pl-[11px]"
                  : "text-ink-300 hover:bg-ink-800/60 hover:text-white"
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-700 px-3 py-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink-300 transition-colors hover:bg-ink-800/60 hover:text-white"
        >
          <IconLogout />
          Sign out
        </button>
      </div>
    </div>
  );
}
