import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from './Components/Navbar/Navbar.jsx'
import { Hero } from './Components/Hero/Hero.jsx'
import Categories from './Components/Categories/Categories.jsx'
import Programs from './Components/Programs/Programs.jsx'
import Verify from "./Pages/Verify.jsx";
import Provider from "./Components/Provider/Provider.jsx";
import ProviderProfile from "./Components/Provider/ProviderProfile.jsx"; // Add this

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />
      <Programs />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/provider/:id" element={<Provider />} />
        <Route path="/become-provider" element={<ProviderProfile />} /> {/* Add this route */}
      </Routes>
    </BrowserRouter>
  )
}
