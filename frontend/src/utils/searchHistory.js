const STORAGE_PREFIX = "search-counts::";

const getUserKey = () => {
  try {
    const email = localStorage.getItem("email");
    return email ? email.toLowerCase() : "guest";
  } catch {
    return "guest";
  }
};

const getStorageKey = () => `${STORAGE_PREFIX}${getUserKey()}`;

export const readSearchCounts = () => {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const recordSearchTerm = (term) => {
  const normalized = term?.trim().toLowerCase();
  if (!normalized) {
    return readSearchCounts();
  }
  const counts = { ...readSearchCounts() };
  counts[normalized] = (counts[normalized] || 0) + 1;
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(counts));
  } catch {
    // ignore storage errors in fallback environments
  }
  window.dispatchEvent(
    new CustomEvent("searchCountsUpdated", { detail: { counts } })
  );
  return counts;
};
