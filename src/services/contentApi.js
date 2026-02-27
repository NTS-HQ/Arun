/**
 * Content API Service
 * Fetches editable content from the backend
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getContent = async (token) => {
  const url = `${BASE_URL}/content`;
  const res = await fetch(url, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.json();
};

const getPageContent = async (page, token) => {
  const url = `${BASE_URL}/content/${page}`;
  const res = await fetch(url, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.json();
};

const updateContent = async (id, data, token) => {
  const url = `${BASE_URL}/content/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

const updateContentByKey = async (page, section, key, value, token) => {
  const url = `${BASE_URL}/content/update/${page}/${section}/${key}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ value }),
  });
  return res.json();
};

const createContent = async (data, token) => {
  const url = `${BASE_URL}/content`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

const deleteContent = async (id, token) => {
  const url = `${BASE_URL}/content/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

const uploadImage = async (file, token) => {
  const url = `${BASE_URL}/content/upload`;
  const formData = new FormData();
  formData.append("image", file);
  
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
};

export default {
  getContent,
  getPageContent,
  updateContent,
  updateContentByKey,
  createContent,
  deleteContent,
  uploadImage,
};
