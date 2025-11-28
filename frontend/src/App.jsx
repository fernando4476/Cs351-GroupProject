// App.jsx wires together routing, providers, and homepage sections for the SPA.
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import { Hero } from "./Components/Hero/Hero.jsx";
import Categories, { DEFAULT_CATEGORIES } from "./Components/Categories/Categories.jsx";
import Programs from "./Components/Programs/Programs.jsx";
import Verify from "./Pages/Verify.jsx";
import Provider from "./Components/Provider/Provider.jsx";
import ProviderProfile from "./Components/Provider/ProviderProfile.jsx";
import AboutUIC from "./Pages/Profile/AboutUIC.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import Feedback from "./Pages/Feedback.jsx";
import AccountDetails from "./Pages/Profile/AccountDetails.jsx";
import Settings from "./Pages/Profile/Settings.jsx";
import MyReviews from "./Pages/Profile/MyReviews.jsx";
import SearchResults from "./Pages/SearchResults.jsx";
import ServiceDetail from "./Pages/ServiceDetail.jsx";
import { useProviders } from "./hooks/useProviders";
import { useServicesApi } from "./hooks/useServicesApi";
import useRecentRecommendations from "./hooks/useRecentRecommendations";
import { recordSearchTerm, readSearchCounts } from "./utils/searchHistory";
import ProviderAccount from "./Pages/Profile/ProviderAccount.jsx";
import Appointments from "./Pages/Appointments.jsx";
import ProviderSettings from "./Pages/Profile/ProviderSettings.jsx";


const useFilteredProviders = (providers, query) => {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return providers;

    return providers.filter((service) => {
      const haystack = [
        service.displayName,
        service.category,
        service.description,
        ...(service.tags || []),
        ...(service.services?.map((s) => s.name) || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [providers, query]);
};

function Home({ providers, services, servicesLoading, servicesError }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [categoryItems, setCategoryItems] = useState(DEFAULT_CATEGORIES);
  const filtered = useFilteredProviders(providers, query);
  const fallbackServices = providers.slice(0, 3);
  const programServices =
    services && services.length > 0
      ? services.slice(0, 3)
      : filtered.slice(0, 3);

  const reorderCategories = useCallback((counts) => {
    const order = [...DEFAULT_CATEGORIES].sort((a, b) => {
      const countA = counts[a.name.toLowerCase()] || 0;
      const countB = counts[b.name.toLowerCase()] || 0;
      if (countA === countB) {
        return 0;
      }
      return countB - countA;
    });
    setCategoryItems(order);
  }, []);

  useEffect(() => {
    reorderCategories(readSearchCounts());
  }, [reorderCategories]);

  useEffect(() => {
    const handleCountsUpdated = (event) => {
      const counts = event.detail?.counts || readSearchCounts();
      reorderCategories(counts);
    };
    window.addEventListener("searchCountsUpdated", handleCountsUpdated);
    return () =>
      window.removeEventListener("searchCountsUpdated", handleCountsUpdated);
  }, [reorderCategories]);

  const handleSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const counts = recordSearchTerm(trimmed);
    reorderCategories(counts);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const categoriesToShow =
    personalizedCategories.length > 0 ? personalizedCategories : categoryItems;

  return (
    <div>
      <Navbar />
      <Hero query={query} onQueryChange={setQuery} onSearch={handleSearch} />
      <Categories onSelectCategory={handleSearch} items={categoriesToShow} />
      <Programs services={programServices} fallback={fallbackServices} />
    </div>
  );
}

export default function App() {
  const providers = useProviders();
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useServicesApi();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              providers={providers}
              services={services}
              servicesLoading={servicesLoading}
              servicesError={servicesError}
            />
          }
        />
        <Route path="/verify" element={<Verify />} />
        <Route path="/provider/:id" element={<Provider />} />
        <Route path="/become-provider" element={<ProviderProfile />} />
        <Route path="/about-uic" element={<AboutUIC />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/account-details" element={<AccountDetails />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/provider-settings" element={<ProviderSettings />} />
        <Route path="/my-feedback" element={<MyReviews />} />
        <Route
          path="/search"
          element={
            <SearchResults
              services={services}
              loading={servicesLoading}
              error={servicesError}
            />
          }
        />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/provider-account" element={<ProviderAccount />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </BrowserRouter>
  );
}
  const { services: recentServices } = useRecentRecommendations();

  const personalizedCategories = useMemo(() => {
    const seen = new Set();
    const items = [];
    recentServices.forEach((svc) => {
      const label =
        svc?.title ||
        svc?.provider?.business_name ||
        svc?.provider?.user?.username ||
        svc?.location;
      const normalized = (label || "").trim().toLowerCase();
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      items.push({ name: label });
    });
    return items.slice(0, DEFAULT_CATEGORIES.length);
  }, [recentServices]);
