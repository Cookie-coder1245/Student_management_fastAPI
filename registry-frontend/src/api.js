import axios from "axios";

// Point this at wherever the FastAPI app is running.
// Override at build time with VITE_API_BASE_URL if needed.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

function unwrap(promise) {
  return promise.then((res) => res.data);
}

export const api = {
  baseUrl: API_BASE_URL,

  async listStudents() {
    const data = await unwrap(client.get("/students"));
    // API returns { "1": {name, age, city}, ... } — normalize to an array
    return Object.entries(data).map(([id, s]) => ({ id, ...s }));
  },

  getStudent(id) {
    return unwrap(client.get(`/students/${id}`));
  },

  createStudent({ id, name, age, city }) {
    return unwrap(client.post("/student", { id, name, age: Number(age), city }));
  },

  updateStudent(id, { name, age, city }) {
    return unwrap(client.put(`/students/${id}`, { id, name, age: Number(age), city }));
  },

  patchStudent(id, partial) {
    return unwrap(client.patch(`/students/${id}`, partial));
  },

  deleteStudent(id) {
    return unwrap(client.delete(`/students/${id}`));
  },

  deleteAll() {
    return unwrap(client.delete("/students"));
  },

  filterByCity(city) {
    return unwrap(client.get("/students/filter", { params: { city } })).then((data) =>
      Object.entries(data).map(([id, s]) => ({ id, ...s }))
    );
  },

  searchByAgeAbove(age) {
    return unwrap(client.get("/students/search", { params: { age } })).then((data) =>
      Object.entries(data).map(([id, s]) => ({ id, ...s }))
    );
  },

  count() {
    return unwrap(client.get("/students/count"));
  },
};

export function extractErrorMessage(err) {
  return (
    err?.response?.data?.detail ||
    err?.message ||
    "Something went wrong talking to the registry server."
  );
}
