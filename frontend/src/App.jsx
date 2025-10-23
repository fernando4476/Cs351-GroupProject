// frontend/src/App.jsx
import React from 'react'
import { Routes, Route } from "react-router-dom"
import Navbar from './Components/Navbar/Navbar.jsx'
import { Hero } from './Components/Hero/Hero.jsx'
import Categories from './Components/Categories/Categories.jsx'
import Programs from './Components/Programs/Programs.jsx'
import Verify from "./Pages/Verify.jsx";

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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/verify" element={<Verify />} />
    </Routes>
  )
}
