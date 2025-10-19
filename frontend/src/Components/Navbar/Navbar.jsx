import React from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";

export default function Navbar({onSignInClick}) {
  return (
    <nav className="container">
        <img src={logo} alt="logo" className="logo"/>
        <ul>
            <li>
              <button className="btn"onClick={onSignInClick}>
                Sign in
              </button>
            </li>
        </ul>
    </nav>
  );
}