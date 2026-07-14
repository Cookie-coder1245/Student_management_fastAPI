import { useRef, useState } from "react";

const CITY_INITIALS = (city) =>
  city
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function StudentCard({ student, onEdit, onDelete }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  function handleMouseMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 12 });
  }

  function handleLeave() {
    setTilt({ x: 0, y: 0 });
    setHovering(false);
  }

  return (
    <div className="tilt-wrap">
      <article
        ref={cardRef}
        className="student-card"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovering ? 1.02 : 1})`,
        }}
      >
        <div className="student-card__sheen" />
        <div className="student-card__top">
          <span className="student-card__id">No. {student.id.padStart(3, "0")}</span>
          <span className="student-card__badge">{CITY_INITIALS(student.city)}</span>
        </div>

        <h3 className="student-card__name">{student.name}</h3>

        <dl className="student-card__meta">
          <div>
            <dt>Age</dt>
            <dd>{student.age}</dd>
          </div>
          <div>
            <dt>City</dt>
            <dd>{student.city}</dd>
          </div>
        </dl>

        <div className="student-card__actions">
          <button className="btn btn--ghost" onClick={() => onEdit(student)}>
            Edit
          </button>
          <button className="btn btn--ghost btn--danger" onClick={() => onDelete(student)}>
            Remove
          </button>
        </div>
      </article>
    </div>
  );
}
