import { useEffect, useState } from "react";

const EMPTY = { id: "", name: "", age: "", city: "" };

export default function StudentFormModal({ mode, student, onClose, onSubmit, error, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (student) {
      setForm({ id: student.id, name: student.name, age: student.age, city: student.city });
    } else {
      setForm(EMPTY);
    }
    const t = setTimeout(() => setFlipped(true), 20);
    return () => clearTimeout(t);
  }, [student]);

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-perspective" onMouseDown={(e) => e.stopPropagation()}>
        <div className={`modal-flip ${flipped ? "is-flipped" : ""}`}>
          <div className="modal-face">
            <header className="modal-header">
              <span className="eyebrow">{mode === "edit" ? "Amend record" : "New entry"}</span>
              <h2>{mode === "edit" ? `Editing ${student?.name}` : "Add a student to the roster"}</h2>
              <button className="modal-close" onClick={onClose} aria-label="Close">
                ×
              </button>
            </header>

            <form onSubmit={handleSubmit} className="form-grid">
              <label className="field">
                <span>Roll number</span>
                <input
                  required
                  disabled={mode === "edit"}
                  value={form.id}
                  onChange={(e) => handleChange("id", e.target.value)}
                  placeholder="e.g. 4"
                  inputMode="numeric"
                />
              </label>

              <label className="field">
                <span>Full name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Zainab Raza"
                />
              </label>

              <label className="field">
                <span>Age</span>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  placeholder="e.g. 21"
                />
              </label>

              <label className="field">
                <span>City</span>
                <input
                  required
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="e.g. Lahore"
                />
              </label>

              {error && <p className="form-error">{error}</p>}

              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--solid" disabled={submitting}>
                  {submitting ? "Saving…" : mode === "edit" ? "Save changes" : "Add student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
