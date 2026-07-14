import { useEffect, useMemo, useState } from "react";
import Constellation from "./components/Constellation";
import StudentCard from "./components/StudentCard";
import StudentFormModal from "./components/StudentFormModal";
import ConfirmDialog from "./components/ConfirmDialog";
import FilterBar from "./components/FilterBar";
import StatsBar from "./components/StatsBar";
import Toast from "./components/Toast";
import { api, extractErrorMessage } from "./api";

// Shown only if the FastAPI server isn't reachable yet, so the
// registry never opens to an empty room.
const DEMO_STUDENTS = [
  { id: "1", name: "Ali", age: 20, city: "Lahore" },
  { id: "2", name: "Ahmed", age: 22, city: "Karachi" },
  { id: "3", name: "Fatima", age: 21, city: "Islamabad" },
];

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [toast, setToast] = useState(null);

  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [ageAbove, setAgeAbove] = useState("");

  const [modal, setModal] = useState(null); // { mode: 'add' | 'edit', student }
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [pendingDelete, setPendingDelete] = useState(null); // student or 'ALL'
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flash(message, type = "info") {
    setToast({ message, type });
    window.clearTimeout(flash._t);
    flash._t = window.setTimeout(() => setToast(null), 3200);
  }

  async function refresh() {
    setLoading(true);
    try {
      const data = await api.listStudents();
      setStudents(data);
      setIsLive(true);
    } catch (err) {
      setStudents(DEMO_STUDENTS);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }

  const cities = useMemo(
    () => Array.from(new Set(students.map((s) => s.city))).sort(),
    [students]
  );

  const groupsForConstellation = useMemo(() => {
    const byCity = {};
    students.forEach((s) => {
      byCity[s.city] = (byCity[s.city] || 0) + 1;
    });
    return Object.entries(byCity).map(([label, count]) => ({ label, count }));
  }, [students]);

  const visibleStudents = useMemo(() => {
    return students.filter((s) => {
      if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (cityFilter && s.city !== cityFilter) return false;
      if (ageAbove && !(Number(s.age) > Number(ageAbove))) return false;
      return true;
    });
  }, [students, query, cityFilter, ageAbove]);

  function openAdd() {
    setFormError("");
    setModal({ mode: "add", student: null });
  }

  function openEdit(student) {
    setFormError("");
    setModal({ mode: "edit", student });
  }

  function closeModal() {
    setModal(null);
    setFormError("");
  }

  async function handleFormSubmit(form) {
    setFormError("");
    if (!form.id || !form.name || !form.age || !form.city) {
      setFormError("Every field is required — the registrar accepts no blanks.");
      return;
    }
    setSubmitting(true);
    try {
      if (modal.mode === "add") {
        if (isLive) {
          await api.createStudent(form);
        } else if (students.some((s) => s.id === form.id)) {
          throw { response: { data: { detail: "That roll number is already on the roster." } } };
        }
        setStudents((prev) => [...prev, { id: form.id, name: form.name, age: Number(form.age), city: form.city }]);
        flash(`${form.name} added to the roster.`, "success");
      } else {
        if (isLive) {
          await api.updateStudent(form.id, form);
        }
        setStudents((prev) =>
          prev.map((s) => (s.id === form.id ? { ...s, name: form.name, age: Number(form.age), city: form.city } : s))
        );
        flash(`${form.name}'s record was updated.`, "success");
      }
      closeModal();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function askDelete(student) {
    setPendingDelete(student);
  }

  function askDeleteAll() {
    setPendingDelete("ALL");
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      if (pendingDelete === "ALL") {
        if (isLive) await api.deleteAll();
        setStudents([]);
        flash("The roster has been cleared.", "danger");
      } else {
        if (isLive) await api.deleteStudent(pendingDelete.id);
        setStudents((prev) => prev.filter((s) => s.id !== pendingDelete.id));
        flash(`${pendingDelete.name} was removed from the roster.`, "danger");
      }
      setPendingDelete(null);
    } catch (err) {
      flash(extractErrorMessage(err), "danger");
    } finally {
      setDeleting(false);
    }
  }

  function clearFilters() {
    setQuery("");
    setCityFilter("");
    setAgeAbove("");
  }

  return (
    <div className="app">
      <section className="hero">
        <div className="hero__scene">
          <Constellation groups={groupsForConstellation} />
        </div>

        <nav className="topbar">
          <div className="brand">
            <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="30" fill="none" stroke="#e8a94c" strokeWidth="2" />
              <path d="M32 16 L44 23 V37 L32 44 L20 37 V23 Z" fill="none" stroke="#4fbdb0" strokeWidth="1.6" />
            </svg>
            <span>The Registry</span>
          </div>
          <span className={`status-pill ${isLive ? "status-pill--live" : "status-pill--demo"}`}>
            <i />
            {isLive ? "Connected to server" : "Offline demo data"}
          </span>
        </nav>

        <div className="hero__content">
          <span className="eyebrow">Student Management System</span>
          <h1>
            Every student,
            <br />
            held in one <em>orbit</em>.
          </h1>
          <p className="hero__sub">
            Search the roster, amend a record, or bring on a new student — the registry keeps every
            city's cohort in view.
          </p>
        </div>
      </section>

      <main className="content">
        <StatsBar total={students.length} shown={visibleStudents.length} cities={cities.length} />

        <FilterBar
          query={query}
          onQueryChange={setQuery}
          cityFilter={cityFilter}
          onCityFilterChange={setCityFilter}
          cities={cities}
          ageAbove={ageAbove}
          onAgeAboveChange={setAgeAbove}
          onClear={clearFilters}
          onAddClick={openAdd}
        />

        {loading ? (
          <div className="empty-state">
            <p>Opening the ledger…</p>
          </div>
        ) : visibleStudents.length === 0 ? (
          <div className="empty-state">
            <h3>No matching records</h3>
            <p>
              {students.length === 0
                ? "The roster is empty. Add the first student to begin."
                : "Nothing matches those filters — try widening the search."}
            </p>
          </div>
        ) : (
          <div className="student-grid">
            {visibleStudents.map((s) => (
              <StudentCard key={s.id} student={s} onEdit={openEdit} onDelete={askDelete} />
            ))}
          </div>
        )}

        {students.length > 0 && (
          <div className="danger-zone">
            <div>
              <h4>Clear the entire roster</h4>
              <p>Removes every student record. This cannot be undone.</p>
            </div>
            <button className="btn btn--danger-outline" onClick={askDeleteAll}>
              Delete all students
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>The Registry — a front desk for {api.baseUrl}</span>
      </footer>

      {modal && (
        <StudentFormModal
          mode={modal.mode}
          student={modal.student}
          onClose={closeModal}
          onSubmit={handleFormSubmit}
          error={formError}
          submitting={submitting}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={pendingDelete === "ALL" ? "Clear the entire roster?" : `Remove ${pendingDelete.name}?`}
          body={
            pendingDelete === "ALL"
              ? "Every student record will be deleted permanently."
              : "This record will be deleted permanently."
          }
          confirmLabel={pendingDelete === "ALL" ? "Delete all" : "Remove student"}
          danger
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
