import { Modal } from "./Modal";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  isDangerous = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} widthClass="max-w-sm">
      <p className="text-sm text-ink-500">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
        <button
          className={isDangerous ? "btn-danger" : "btn-primary"}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Working…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
