export const getAccessToken = () => localStorage.getItem("access") || null;

export const getAuthHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
