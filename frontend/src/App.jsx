import React, { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/Hero";
import Categories from "./Components/Categories/Categories";
import Programs from "./Components/Programs/Programs";
import LoginModal from "./Components/Login/LoginModal";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

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
