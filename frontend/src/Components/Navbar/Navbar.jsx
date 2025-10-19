import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'

export const Navbar = () => {
  return (
    <nav className='container'>
        <img src={logo} alt="logo" className='logo'/>
        <ul>
            <li><button className="btn">Sign in</button> </li>
        </ul>
    </nav>
  )
}
export default Navbar