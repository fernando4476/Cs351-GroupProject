import React from 'react'
import Navbar from './Components/Navbar/Navbar.jsx'
import { Hero } from './Components/Hero/Hero.jsx'
import Categories from './Components/Categories/Categories.jsx'
import Programs from './Components/Programs/Programs.jsx'

export const App = () => {
  return (
    <div>
      <Navbar />
      <Hero />      {/* This should contain the search bar */}
      <Categories />
      <Programs />
    </div>
  )
}
export default App