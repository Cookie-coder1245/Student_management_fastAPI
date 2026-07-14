export default function ConfirmDialog({ title, body, confirmLabel = "Confirm", danger, onConfirm, onCancel, busy }) {
  return (
    <div className="modal-overlay" onMouseDown={onCancel}>
      <div className="confirm-card" onMouseDown={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{body}</p>
        <div className="form-actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`btn ${danger ? "btn--danger-solid" : "btn--solid"}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
