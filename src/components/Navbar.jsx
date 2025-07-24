// Importing React to create the component
import React from "react";

// Importing the logo image
import logo from "../assets/logo.svg";

// Importing the CSS file for styling the Navbar
import "../css/Navbar.css";

// Defining the functional component Navbar, which receives onNavigate as a prop
function Navbar({ onNavigate }) {
  return (
    // Main navigation bar container with a CSS class for styling
    <header className="navbar">
      
      {/* Left section of the navbar: logo */}
      <div className="navbar-logo">
        <img src={logo} alt="logo" /> {/* Displaying the company logo */}
      </div>

      {/* Right section of the navbar: navigation links */}
      <nav className="navbar-links">
        {/* Navigation link to the "dashboard" section */}
        <a
          href="#services"
          onClick={(e) => {
            e.preventDefault();       // Prevent the default anchor behavior
            onNavigate("dashboard");  // Trigger the navigation to "dashboard"
          }}
        >
          Services
        </a>

        {/* Navigation link to the "home" section (could be 'Contact' page later) */}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          Contactez-Nous
        </a>

        {/* Navigation link to log out (currently redirects to "home") */}
        <a
          href="#logout"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home"); // You can replace this with a real logout function later
          }}
        >
          Déconnecter
        </a>
      </nav>
    </header>
  );
}

// Exporting the component so it can be used in other parts of the app
export default Navbar;
