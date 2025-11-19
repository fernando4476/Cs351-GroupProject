import { useEffect, useState, useCallback } from "react";
import { buildApiUrl } from "../utils/api";

const SERVICES_URL = buildApiUrl("/services/");

export const useServicesApi = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SERVICES_URL);
      if (!response.ok) {
        throw new Error("Unable to load services");
      }
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    const handleUpdate = () => fetchServices();
    window.addEventListener("servicesUpdated", handleUpdate);
    return () => {
      window.removeEventListener("servicesUpdated", handleUpdate);
    };
  }, [fetchServices]);

  return { services, loading, error, refresh: fetchServices };
};

export default useServicesApi;
