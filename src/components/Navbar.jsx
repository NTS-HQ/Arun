import "../styles/index.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/sru_logo.png";
import { FaChevronDown } from "react-icons/fa";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeAll = () => {
    setOpenDropdown(null);
    setMenuOpen(false);
  };

  return (
    <header className="w-full z-800 absolute bg-white lg:bg-transparent">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
        </Link>

        {/* -------------------- DESKTOP NAV -------------------- */}
        <div className="hidden md:flex items-center space-x-4">

          {/* -------- PAGES DROPDOWN -------- */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("pages")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              onClick={() => toggleDropdown("pages")}
              className="px-4 py-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
            >
              Pages <FaChevronDown className="text-xs" />
            </button>

            {openDropdown === "pages" && (
              <div className="absolute right-0 mt-0 w-48 bg-white shadow-lg rounded-xl border border-gray-100 py-2">
                <Link
                  to="/" onClick={closeAll}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Home
                </Link>
                <Link
                  to="/about-us" onClick={closeAll}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  About
                </Link>
                <Link
                  to="/our-works" onClick={closeAll}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Our Work
                </Link>
              </div>
            )}
          </div>

          {/* -------- CONTACT DROPDOWN -------- */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("contact")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              onClick={() => toggleDropdown("contact")}
              className="px-4 py-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
            >
              Contact <FaChevronDown className="text-xs" />
            </button>

            {openDropdown === "contact" && (
              <div className="absolute right-0 mt-0 w-56 bg-white shadow-lg rounded-xl border border-gray-100 py-2">
                <Link
                  to="/contact-us" onClick={closeAll}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Contact Us
                </Link>
                <Link
                  to="/help-required" onClick={closeAll}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Help Required
                </Link>
                <Link
                  to="/join-our-team" onClick={closeAll}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Join Our Team
                </Link>
              </div>
            )}
          </div>

          {/* -------- DONATE CTA -------- */}
          <Link
            to="/donate"
            onClick={closeAll}
            className="px-5 py-1 rounded-full bg-black text-white hover:bg-gray-900 transition"
          >
            Donate
          </Link>
        </div>

        {/* -------------------- MOBILE HAMBURGER -------------------- */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-800 focus:outline-none"
        >
          {menuOpen ? (
            <span className="text-3xl font-light">&#10005;</span>
          ) : (
            <span className="text-3xl">&#9776;</span>
          )}
        </button>
      </div>

      {/* -------------------- MOBILE MENU -------------------- */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 space-y-3 px-4">

          {/* PAGES MOBILE DROPDOWN */}
          <button
            onClick={() => toggleDropdown("pages")}
            className="block w-full text-left px-4 py-2 rounded-full border border-gray-300 text-gray-700 flex justify-between items-center"
          >
            Pages <FaChevronDown className="text-xs" />
          </button>

          {openDropdown === "pages" && (
            <div className="ml-4 space-y-2">
              <Link to="/" onClick={closeAll} className="block text-gray-700">Home</Link>
              <Link to="/about-us" onClick={closeAll} className="block text-gray-700">About</Link>
              <Link to="/our-works" onClick={closeAll} className="block text-gray-700">Our Work</Link>
            </div>
          )}

          {/* CONTACT MOBILE DROPDOWN */}
          <button
            onClick={() => toggleDropdown("contact")}
            className="block w-full text-left px-4 py-2 rounded-full border border-gray-300 text-gray-700 flex justify-between items-center"
          >
            Contact <FaChevronDown className="text-xs" />
          </button>

          {openDropdown === "contact" && (
            <div className="ml-4 space-y-2">
              <Link to="/contact-us" onClick={closeAll} className="block text-gray-700">Contact Us</Link>
              <Link to="/help-required" onClick={closeAll} className="block text-gray-700">Help Required</Link>
              <Link to="/join-our-team" onClick={closeAll} className="block text-gray-700">Join Our Team</Link>
            </div>
          )}

          {/* DONATE CTA (Mobile) */}
          <Link
            to="/donate"
            onClick={closeAll}
            className="block px-4 py-2 rounded-full bg-black text-white text-center"
          >
            Donate
          </Link>
        </div>
      )}
    </header>
  );
}