/**
 * api/index.js — Centralized API helper using async/await fetch.
 *
 * Features:
 * - Automatic JSON serialization
 * - JWT token injection from localStorage
 * - Centralized error handling
 * - AbortSignal support for cancellation
 * - 401 auto-logout on token expiry
 *
 * Vite proxies /api → :5000 in dev; Vercel routes to serverless in prod.
 */

const BASE = "/api";

const getToken = () => localStorage.getItem("codex_token");

const buildHeaders = (extra = {}) => {
  const headers = { "Content-Type": "application/json", ...extra };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

/** Centralized response handler — throws on !ok with message */
const handleRes = async (res) => {
  // 401 → token expired or invalid → clear and reload
  if (res.status === 401) {
    // Don't redirect on auth endpoints — a 401 there is an expected
    // "wrong credentials" response that the form should surface inline.
    const isAuthAttempt =
      res.url.includes("/auth/login") ||
      res.url.includes("/auth/register") ||
      res.url.includes("/users/login") ||
      res.url.includes("/users/register");
    if (!isAuthAttempt) {
      localStorage.removeItem("codex_token");
      localStorage.removeItem("codex_user");
      window.location.href = "/";
    }
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server returned ${res.status}`);
  }
  if (!res.ok)
    throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
};

const buildQuery = (params) => {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  return filtered.length ? "?" + new URLSearchParams(filtered).toString() : "";
};

const request = (url, options = {}) =>
  fetch(`${BASE}${url}`, {
    ...options,
    headers: buildHeaders(options.headers),
  }).then(handleRes);

const get = (url, signal) => request(url, { method: "GET", signal });
const post = (url, body, signal) =>
  request(url, { method: "POST", body: JSON.stringify(body), signal });
const put = (url, body, signal) =>
  request(url, { method: "PUT", body: JSON.stringify(body), signal });
const patch = (url, body, signal) =>
  request(url, { method: "PATCH", body: JSON.stringify(body), signal });
const del = (url, signal) => request(url, { method: "DELETE", signal });

// ─── AUTH ───
// New endpoints live under /api/auth (with passport.js + OAuth).
// /api/users/login & /api/users/register stay as backwards-compat aliases.
export const login = (email, password) =>
  post("/auth/login", { email, password });
export const register = (name, email, password) =>
  post("/auth/register", { name, email, password });
export const fetchCurrentUser = (signal) => get("/auth/me", signal);
export const logoutApi = () => post("/auth/logout", {});
export const getAuthProviders = (signal) => get("/auth/providers", signal);
/** Absolute URL (so the browser will follow it) to start an OAuth flow. */
export const oauthStartUrl = (provider) => `${BASE}/auth/${provider}`;

// ─── PRODUCTS ───
export const getProducts = (params = {}, signal) =>
  get(`/products${buildQuery(params)}`, signal);
export const getProductById = (id, signal) => get(`/products/${id}`, signal);
export const createProduct = (data) => post("/products", data);
export const updateProduct = (id, data) => put(`/products/${id}`, data);
export const deleteProduct = (id) => del(`/products/${id}`);

// ─── CATEGORIES ───
export const getCategories = (signal) => get("/categories", signal);
export const createCategory = (data) => post("/categories", data);
export const updateCategory = (id, data) => put(`/categories/${id}`, data);
export const deleteCategory = (id) => del(`/categories/${id}`);

// ─── ORDERS ───
export const createOrder = (data) => post("/orders", data);
export const getOrders = (params = {}, signal) =>
  get(`/orders${buildQuery(params)}`, signal);
export const getOrderById = (id, signal) => get(`/orders/${id}`, signal);
export const updateOrderStatus = (id, status) =>
  patch(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => del(`/orders/${id}`);

// ─── PROMOS ───
export const getActivePromos = (signal) => get("/promos/active", signal);
export const validatePromo = (code, subtotal) =>
  post("/promos/validate", { code, subtotal });
export const getPromos = (params = {}, signal) =>
  get(`/promos${buildQuery(params)}`, signal);
export const createPromo = (data) => post("/promos", data);
export const updatePromo = (id, data) => put(`/promos/${id}`, data);
export const deletePromo = (id) => del(`/promos/${id}`);

// ─── USERS (admin) ───
export const getUsers = (params = {}, signal) =>
  get(`/users${buildQuery(params)}`, signal);
export const updateUser = (id, data) => put(`/users/${id}`, data);
export const deleteUser = (id) => del(`/users/${id}`);

// ─── STATS ───
export const getDashboardStats = (signal) => get("/stats", signal);

// ─── CALLS (WebRTC signaling via REST + DB polling) ───
export const initiateCall = (sdpOffer) =>
  post("/calls", { sdp_offer: sdpOffer });
export const getIncomingCall = (signal) => get("/calls/incoming", signal);
export const getCall = (id, signal) => get(`/calls/${id}`, signal);
export const submitCallAnswer = (id, sdpAnswer) =>
  post(`/calls/${id}/answer`, { sdp_answer: sdpAnswer });
export const addIceCandidate = (id, candidate) =>
  post(`/calls/${id}/ice`, { candidate });
export const endCall = (id) => patch(`/calls/${id}/end`, {});
export const declineCall = (id) => patch(`/calls/${id}/decline`, {});
