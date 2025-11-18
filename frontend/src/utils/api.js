const normalizeBaseUrl = (url) => {
  if (!url) return null;
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const DEFAULT_BASE_URL = "http://localhost:8000/api";

export const API_BASE_URL =
  normalizeBaseUrl(import.meta.env?.VITE_API_BASE_URL) || DEFAULT_BASE_URL;

export const buildApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
