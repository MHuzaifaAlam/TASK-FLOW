import { IconMenu } from "./icons";

export function Topbar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-md p-1.5 text-ink-500 hover:bg-ink-50 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <IconMenu />
        </button>
        <h1 className="font-display text-lg font-semibold text-ink-900">{title}</h1>
      </div>
    </header>
  );
}
