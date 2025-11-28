export const getAccessToken = () => localStorage.getItem("access") || null;
export const getRefreshToken = () => localStorage.getItem("refresh") || null;

export const getAuthHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Remove stored auth tokens/user info when unauthorized or logging out.
export const clearAuthStorage = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
};

export const setAccessToken = (access) => {
  if (access) {
    localStorage.setItem("access", access);
  }
};

// Decode JWT payload (no signature verification) to read user info like user_id.
const parseJwtPayload = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base + "=".repeat((4 - (base.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const getUserIdFromToken = () => {
  const payload = parseJwtPayload(getAccessToken());
  return payload?.user_id || payload?.userId || null;
};
