import { buildApiUrl } from "../utils/api";
import {
  getAuthHeaders,
  getUserIdFromToken,
  clearAuthStorage,
  getRefreshToken,
  setAccessToken,
} from "../utils/auth";

const parseError = async (response) => {
  let detail = "Request failed";
  try {
    const data = await response.json();
    detail = data?.detail || data?.error || data?.message || detail;
  } catch (error) {
   
  }
  if (Array.isArray(detail)) {
    return detail.join(" ");
  }
  if (typeof detail === "object") {
    return Object.values(detail).flat().join(" ");
  }
  return detail;
};

let refreshInFlight = null;

const refreshAccessToken = async () => {
  if (refreshInFlight) return refreshInFlight;
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");
  refreshInFlight = fetch(buildApiUrl("/auth/token/refresh/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const message = await parseError(res);
        throw new Error(message || "Refresh failed");
      }
      return res.json();
    })
    .then((data) => {
      if (data?.access) {
        setAccessToken(data.access);
        return data.access;
      }
      throw new Error("Refresh failed");
    })
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
};

const jsonRequest = async (
  path,
  { method = "GET", body, headers = {}, signal } = {},
  attempt = 0
) => {
  const mergedHeaders = {
    ...headers,
    ...getAuthHeaders(),
  };

  const response = await fetch(buildApiUrl(path), {
    method,
    headers: mergedHeaders,
    body,
    signal,
  });

  if (!response.ok) {
    if (response.status === 401) {
        // Try to refresh once if we had an auth header and a refresh token
      const hasAuth = !!mergedHeaders.Authorization;
      if (hasAuth && attempt === 0 && getRefreshToken()) {
        try {
          await refreshAccessToken();
          return jsonRequest(path, { method, body, headers, signal }, attempt + 1);
        } catch (err) {
          clearAuthStorage();
          throw new Error("Session expired. Please sign in again.");
        }
      }
      clearAuthStorage();
      throw new Error("Unauthorized. Please sign in again.");
    }
    const message = await parseError(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const signup = ({ name, email, password }) =>
  jsonRequest("/auth/signup/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

export const login = ({ email, password }) =>
  jsonRequest("/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

export const createProviderProfile = ({
  business_name,
  description,
  phone,
  photo,
}) => {
  const formData = new FormData();
  formData.append("business_name", business_name || "");
  formData.append("description", description || "");
  formData.append("phone", phone || "");
  if (photo) {
    formData.append("photo", photo);
  }

  return fetch(buildApiUrl("/auth/service-provider/"), {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  }).then(async (response) => {
    if (!response.ok) {
      const message = await parseError(response);
      throw new Error(message);
    }
    return response.json();
  });
};

export const fetchMyProviderProfile = () =>
  jsonRequest("/auth/service-provider/me/", {
    headers: {
      ...getAuthHeaders(),
    },
  });

export const createServiceListing = ({ title, description, price, duration, location }) =>
  jsonRequest("/services/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ title, description, price, duration, location }),
  });

export const fetchServices = (options) => jsonRequest("/services/", options);

export const fetchServiceDetail = (id, options) =>
  jsonRequest(`/services/${id}/`, options);

export const updateService = (id, payload) =>
  jsonRequest(`/services/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

export const deleteService = (id) =>
  jsonRequest(`/services/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

export const fetchProviders = () =>
  jsonRequest("/auth/providers/", {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

export const fetchProviderReviews = (providerId, options) =>
  jsonRequest(`/providers/${providerId}/reviews/`, options);

export const createProviderReview = ({ providerId, rating, comment }) =>
  jsonRequest(`/providers/${providerId}/reviews/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ rating, comment }),
  });

export const fetchProviderRating = (providerId, options) =>
  jsonRequest(`/providers/${providerId}/rating/`, options);

export const recordRecentView = (serviceId) =>
  jsonRequest("/recent/view/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ service_id: serviceId }),
  });

export const bookService = ({ providerId, serviceId, date, time, note }) =>
  jsonRequest(`/providers/${providerId}/services/${serviceId}/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ service: serviceId, date, time, note }),
  });

// Auth / profile
export const fetchMe = () =>
  jsonRequest("/auth/profile/me/", {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

export const updateProfile = ({ first_name, last_name, photo }) => {
  const form = new FormData();
  if (first_name) form.append("first_name", first_name);
  if (last_name) form.append("last_name", last_name);
  if (photo instanceof File) form.append("photo", photo);
  return jsonRequest("/auth/profile/update/", {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
    },
    body: form,
  });
};

// Provider profile for current user
export const fetchProviderProfile = async () => {
  try {
    return await jsonRequest("/auth/service-provider/me/", {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
  } catch (err) {
    // Fallback to list + match if direct endpoint missing
    const userId = getUserIdFromToken();
    if (!userId) return null;
    const providers = await fetchProviders();
    if (!Array.isArray(providers)) return null;
    return providers.find((p) => `${p.user}` === `${userId}`) || null;
  }
};

// Provider services filtered by provider_id
export const fetchProviderServices = async (providerId) => {
  const services = await fetchServices({
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!Array.isArray(services)) return [];
  return services.filter(
    (svc) => `${svc?.provider?.id ?? svc?.provider}` === `${providerId}`
  );
};

// Provider bookings
export const fetchProviderBookings = (providerId) =>
  jsonRequest(`/providers/${providerId}/bookings/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

// Customer bookings
export const fetchMyBookings = () =>
  jsonRequest("/bookings/my/", {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

export const updateBooking = (bookingId, payload) =>
  jsonRequest(`/bookings/${bookingId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

export const deleteBooking = (bookingId) =>
  jsonRequest(`/bookings/${bookingId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
