import { buildApiUrl } from "../utils/api";
import { getAuthHeaders } from "../utils/auth";

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

const jsonRequest = async (
  path,
  { method = "GET", body, headers = {}, signal } = {}
) => {
  const response = await fetch(buildApiUrl(path), {
    method,
    headers,
    body,
    signal,
  });

  if (!response.ok) {
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

export const createProviderProfile = ({ business_name, description, phone }) =>
  jsonRequest("/auth/service-provider/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ business_name, description, phone }),
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
