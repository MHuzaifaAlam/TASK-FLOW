interface PaginationProps {
  count: number;
  pageSize: number;
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export function Pagination({ count, pageSize, page, hasNext, hasPrevious, onNext, onPrevious }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const start = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, count);

  return (
    <div className="flex items-center justify-between border-t border-line px-4 py-3">
      <p className="text-xs text-ink-400">
        {count === 0 ? "No results" : `Showing ${start}–${end} of ${count}`}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-ink-400">
          Page {page} of {totalPages}
        </span>
        <button className="btn-secondary px-2.5 py-1.5 text-xs" onClick={onPrevious} disabled={!hasPrevious}>
          Previous
        </button>
        <button className="btn-secondary px-2.5 py-1.5 text-xs" onClick={onNext} disabled={!hasNext}>
          Next
        </button>
      </div>
    </div>
  );
}
