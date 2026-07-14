# The Registry — Student Management System (Frontend)

A React frontend for your FastAPI + JSON student management API, built around
a "campus registry" identity: a slowly turning 3D constellation (one orbit
per city) as the hero, and physical, ID-card-style records you can tilt,
flip open, search, and edit.

## What's inside

- **Search** by name, **filter** by city, **filter** by age threshold
- **Add / edit / delete** a student, and **delete the whole roster**
- Live stats (total on roster, currently shown, cities represented)
- Falls back to demo data automatically if the API isn't running yet, so the
  page never opens empty — look for the pill in the top-right corner to see
  whether you're live or in demo mode

## Running it

### 1. Start the backend

The `backend/` folder next to this one has your original API with one
addition: CORS middleware, so the browser is allowed to call it from a
different port.

```bash
cd backend
pip install fastapi uvicorn
uvicorn student_management_api_using_json:app --reload
```

This serves the API at `http://127.0.0.1:8000`.

### 2. Start the frontend

```bash
cd registry-frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

If your backend runs somewhere other than `http://127.0.0.1:8000`, copy
`.env.example` to `.env` and change `VITE_API_BASE_URL`.

## Notes on the design

- **Colors**: deep indigo background, a warm brass/gold for primary actions
  and one city-cluster, a cool teal for the other and for "live" status.
- **Type**: Fraunces for headings (the ledger/seal feel), Space Grotesk for
  UI, IBM Plex Mono for IDs and numbers.
- **The signature piece**: `src/components/Constellation.jsx` draws students
  as small lit nodes on rings, one ring per city, sized by how many students
  are in that city — built with three.js, no extra assets required.
- Student cards (`src/components/StudentCard.jsx`) tilt in 3D toward your
  cursor; the add/edit modal flips in like a card being turned over.

## Project structure

```
src/
  api.js                     — talks to the FastAPI backend
  App.jsx                    — page state and layout
  components/
    Constellation.jsx        — 3D hero background
    StudentCard.jsx           — tilting record card
    StudentFormModal.jsx      — add / edit form
    ConfirmDialog.jsx         — delete confirmation
    FilterBar.jsx             — search + filters
    StatsBar.jsx              — roster stats
    Toast.jsx                 — notifications
  styles/
    globals.css               — design tokens
    app.css                   — layout & component styles
```
