/**
 * ============================================================
 *  API Service Helper
 * ============================================================
 *  Centralised HTTP client for all backend API calls.
 *  Uses the VITE_API_URL env variable so the base URL is
 *  never hard-coded inside components.
 *
 *  Usage:
 *    import api from "../services/api";
 *    const res = await api.post("/contact", { name, email, … });
 *    const res = await api.get("/admin/contacts", token);
 *    const res = await api.upload("/join", formData);
 * ============================================================
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Generic JSON request helper.
 * @param {string} endpoint   — e.g. "/contact"
 * @param {object} options    — fetch options override
 * @returns {Promise<object>} — parsed JSON response
 */
const request = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await res.json();
    return data;
};

/**
 * POST JSON data.
 * @param {string} endpoint
 * @param {object} body
 */
const post = (endpoint, body) =>
    request(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
    });

/**
 * POST multipart FormData (for file uploads).
 * Does NOT set Content-Type — the browser handles the boundary.
 * @param {string} endpoint
 * @param {FormData} formData
 */
const upload = async (endpoint, formData) => {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url, {
        method: "POST",
        body: formData,
    });
    return res.json();
};

/**
 * GET with optional auth token.
 * @param {string} endpoint
 * @param {string} [token]
 */
const get = (endpoint, token) =>
    request(endpoint, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

/**
 * DELETE with auth token.
 * @param {string} endpoint
 * @param {string} token
 */
const del = (endpoint, token) =>
    request(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

/**
 * PATCH with auth token.
 * @param {string} endpoint
 * @param {object} body
 * @param {string} token
 */
const patch = (endpoint, body, token) =>
    request(endpoint, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { Authorization: `Bearer ${token}` },
    });

export default { post, upload, get, del, patch };
