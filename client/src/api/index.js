/**
 * api/index.js — Centralized API helper using async/await fetch.
 * Uses relative /api paths — Vite proxies to :5000 in dev,
 * and Vercel routes to serverless function in production.
 */

const BASE = "/api";

const getToken = () => localStorage.getItem("codex_token");

const headers = (extra = {}) => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const handleRes = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// AUTH
export const login = (email, password) =>
  fetch(`${BASE}/users/login`, { method: "POST", headers: headers(), body: JSON.stringify({ email, password }) }).then(handleRes);

export const register = (name, email, password) =>
  fetch(`${BASE}/users/register`, { method: "POST", headers: headers(), body: JSON.stringify({ name, email, password }) }).then(handleRes);

// PRODUCTS
export const getProducts = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return fetch(`${BASE}/products?${q}`, { headers: headers() }).then(handleRes);
};

export const getProductById = (id) =>
  fetch(`${BASE}/products/${id}`, { headers: headers() }).then(handleRes);

export const createProduct = (data) =>
  fetch(`${BASE}/products`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleRes);

export const updateProduct = (id, data) =>
  fetch(`${BASE}/products/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(handleRes);

export const deleteProduct = (id) =>
  fetch(`${BASE}/products/${id}`, { method: "DELETE", headers: headers() }).then(handleRes);

// CATEGORIES
export const getCategories = () =>
  fetch(`${BASE}/categories`, { headers: headers() }).then(handleRes);

export const createCategory = (data) =>
  fetch(`${BASE}/categories`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleRes);

export const updateCategory = (id, data) =>
  fetch(`${BASE}/categories/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(handleRes);

export const deleteCategory = (id) =>
  fetch(`${BASE}/categories/${id}`, { method: "DELETE", headers: headers() }).then(handleRes);

// ORDERS
export const createOrder = (data) =>
  fetch(`${BASE}/orders`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleRes);

export const getOrders = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return fetch(`${BASE}/orders?${q}`, { headers: headers() }).then(handleRes);
};

export const getOrderById = (id) =>
  fetch(`${BASE}/orders/${id}`, { headers: headers() }).then(handleRes);

export const updateOrderStatus = (id, status) =>
  fetch(`${BASE}/orders/${id}/status`, { method: "PATCH", headers: headers(), body: JSON.stringify({ status }) }).then(handleRes);

export const deleteOrder = (id) =>
  fetch(`${BASE}/orders/${id}`, { method: "DELETE", headers: headers() }).then(handleRes);

// PROMOS
export const getActivePromos = () =>
  fetch(`${BASE}/promos/active`, { headers: headers() }).then(handleRes);

export const validatePromo = (code, subtotal) =>
  fetch(`${BASE}/promos/validate`, { method: "POST", headers: headers(), body: JSON.stringify({ code, subtotal }) }).then(handleRes);

export const getPromos = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return fetch(`${BASE}/promos?${q}`, { headers: headers() }).then(handleRes);
};

export const createPromo = (data) =>
  fetch(`${BASE}/promos`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleRes);

export const updatePromo = (id, data) =>
  fetch(`${BASE}/promos/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(handleRes);

export const deletePromo = (id) =>
  fetch(`${BASE}/promos/${id}`, { method: "DELETE", headers: headers() }).then(handleRes);

// USERS (admin)
export const getUsers = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return fetch(`${BASE}/users?${q}`, { headers: headers() }).then(handleRes);
};

export const updateUser = (id, data) =>
  fetch(`${BASE}/users/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(handleRes);

export const deleteUser = (id) =>
  fetch(`${BASE}/users/${id}`, { method: "DELETE", headers: headers() }).then(handleRes);

// STATS
export const getDashboardStats = () =>
  fetch(`${BASE}/stats`, { headers: headers() }).then(handleRes);
