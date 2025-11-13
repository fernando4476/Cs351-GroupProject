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

export const App = () => {
  return (
    <>
      <Navbar onSignInClick={() => setShowLogin(true)} />
      <Hero />
      <Categories />
      <Programs />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
