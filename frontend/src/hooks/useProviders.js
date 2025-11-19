import { useEffect, useState } from "react";
import { servicesData } from "../data/services";

const STORAGE_PREFIX = "provider::";

const loadLocalProviders = () => {
  const providers = [];
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed?.id && parsed.displayName) {
          providers.push({
            ...parsed,
            source: "custom",
            image: parsed.image || null,
          });
        }
      }
    });
  } catch (err) {
    console.error("Failed to load providers", err);
  }
  return providers;
};

export const useProviders = () => {
  const loadAll = () => [
    ...servicesData.map((service) => ({
      ...service,
      source: "static",
    })),
    ...loadLocalProviders(),
  ];

  const [providers, setProviders] = useState(loadAll);

  useEffect(() => {
    const refresh = () => {
      setProviders(loadAll());
    };

    const handleStorage = (event) => {
      if (event && event.key && !event.key.startsWith(STORAGE_PREFIX)) {
        return;
      }
      refresh();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("providersUpdated", refresh);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("providersUpdated", refresh);
    };
  }, []);

  return providers;
};
