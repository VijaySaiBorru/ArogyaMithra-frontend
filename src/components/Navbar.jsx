import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add safety checks to avoid parsing undefined
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const patient = localStorage.getItem("patient") ? JSON.parse(localStorage.getItem("patient")) : null;

  const handleLoginClick = () => {
    if (patient) {
      navigate("/patient-dashboard");
    } else if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "frontdesk") {
        navigate("/frontdesk-dashboard");
      } else if (user.role === "dataentry") {
        navigate("/dataentry-dashboard");
      } else if (user?.hcpData?.designation === "Doctor") {
        navigate("/doctor-dashboard");
      } else if (user?.hcpData?.designation === "Nurse") {
        navigate("/nurse-dashboard");
      } else if (user?.hcpData?.designation === "Junior Doctor") {
        navigate("/jr-doctor-dashboard");
      } else if (user?.hcpData?.designation === "Therapist") {
        navigate("/therapist-dashboard");
      } else {
        navigate("/login"); // fallback
      }
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false); // Close menu on link click
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to check if the current path matches the link
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <img src="/name.png" alt="ArogyaMithra Logo" className="w-50 h-auto object-contain" />
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          className="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <ul
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center gap-6 md:gap-8 text-lg font-medium text-gray-700 absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent p-6 md:p-0 shadow-md md:shadow-none transition-all duration-300 ease-in-out`}
        >
          <li>
            <Link
              to="/"
              className={`block py-2 md:py-0 hover:text-blue-700 transition-colors duration-200 ${isActive('/') ? 'border-b-2 border-blue-700' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={`block py-2 md:py-0 hover:text-blue-700 transition-colors duration-200 ${isActive('/services') ? 'border-b-2 border-blue-700' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="/about-hospital"
              className={`block py-2 md:py-0 hover:text-blue-700 transition-colors duration-200 ${isActive('/about-hospital') ? 'border-b-2 border-blue-700' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`block py-2 md:py-0 hover:text-blue-700 transition-colors duration-200 ${isActive('/about') ? 'border-b-2 border-blue-700' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Website
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`block py-2 md:py-0 hover:text-blue-700 transition-colors duration-200 ${isActive('/contact') ? 'border-b-2 border-blue-700' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </li>
          <li>
            <button
              onClick={handleLoginClick}
              className="block w-full md:w-auto text-white bg-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              {(user || patient) ? "Go to Dashboard" : "Login"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
