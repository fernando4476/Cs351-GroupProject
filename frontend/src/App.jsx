import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import { Hero } from "./Components/Hero/Hero.jsx";
import Categories from "./Components/Categories/Categories.jsx";
import Programs from "./Components/Programs/Programs.jsx";
import Verify from "./Pages/Verify.jsx";
import Provider from "./Components/Provider/Provider.jsx";
import ProviderProfile from "./Components/Provider/ProviderProfile.jsx";
import AboutUIC from "./Pages/Profile/AboutUIC.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import Feedback from "./Pages/Feedback.jsx";
import AccountDetails from "./Pages/Profile/AccountDetails.jsx";
import Settings from "./Pages/Profile/Settings.jsx";
import Reviews from "./Pages/Profile/Reviews.jsx";
import ProviderAccount from "./Pages/Profile/ProviderAccount.jsx";
import Appointments from "./Pages/Appointments.jsx";


function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />
      <Programs />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/provider/:id" element={<Provider />} />
        <Route path="/become-provider" element={<ProviderProfile />} />
        <Route path="/about-uic" element={<AboutUIC />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/account-details" element={<AccountDetails />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/account-details" element={<AccountDetails />} />
        <Route path="/provider-account" element={<ProviderAccount />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </BrowserRouter>
  );
}
