export default function FilterBar({
  query,
  onQueryChange,
  cityFilter,
  onCityFilterChange,
  cities,
  ageAbove,
  onAgeAboveChange,
  onClear,
  onAddClick,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name…"
          aria-label="Search students by name"
        />
      </div>

      <div className="filter-bar__group">
        <label className="filter-bar__select">
          <span>City</span>
          <select value={cityFilter} onChange={(e) => onCityFilterChange(e.target.value)}>
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-bar__select">
          <span>Age above</span>
          <input
            type="number"
            min="0"
            value={ageAbove}
            onChange={(e) => onAgeAboveChange(e.target.value)}
            placeholder="any"
          />
        </label>

        {(query || cityFilter || ageAbove) && (
          <button className="btn btn--ghost btn--small" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      <button className="btn btn--solid" onClick={onAddClick}>
        + Add student
      </button>
    </div>
  );
}
