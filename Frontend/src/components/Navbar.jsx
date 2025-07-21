"use client"

import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"
import { AuthContext } from "../context/AuthContext"
import { useContext, useEffect, useState } from "react"

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function getCurrentUser() {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch("http://localhost:3000/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (data.success === false || data.error) {
          setUser(null)
        } else {
          setUser(data)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
        setUser(null)
      }
    }
    getCurrentUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setShowDropdown(false)
    setShowMobileMenu(false)
    navigate("/login")
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  const closeMobileMenu = () => {
    setShowMobileMenu(false)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest(".navbar")) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [showMobileMenu])

  return (
    <nav className="navbar">
      <div className="logo">
        <img className="navbar__logo" src="/logo.png" alt="logo" />
        {user ? `Welcome ${user.name}!` : "Welcome to Our LocalBazaar"}
      </div>

      {/* Desktop Menu */}
      <div className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/add">Sell Products</Link>
        <Link to="/my">My Products</Link>
        <Link to="/cart">Cart</Link>
        {/* <Link to="/about">About</Link> */}

        {user ? (
          <div className="profile-menu">
            <img
              src={user.profilePic || "/placeholder.svg"}
              alt={user.name}
              className="user-image"
              onClick={() => setShowDropdown((prev) => !prev)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="navbar__cta">
              Login
            </Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {showMobileMenu ? "✕" : "☰"}
      </button>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${showMobileMenu ? "open" : ""}`}>
        <div className="mobile-menu-content">
          <Link to="/" className="mobile-menu-item" onClick={closeMobileMenu}>
            🏠 Home
          </Link>
          <Link to="/add" className="mobile-menu-item" onClick={closeMobileMenu}>
            💰 Sell Products
          </Link>
          <Link to="/my" className="mobile-menu-item" onClick={closeMobileMenu}>
            📦 My Products
          </Link>
          <Link to="/cart" className="mobile-menu-item" onClick={closeMobileMenu}>
            🛒 Cart
          </Link>

          {user ? (
            <div className="mobile-profile-section">
              <div className="mobile-user-info">
                <img src={user.profilePic || "/placeholder.svg"} alt={user.name} className="mobile-user-image" />
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="mobile-logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="mobile-menu-item cta" onClick={closeMobileMenu}>
                Login
              </Link>
              <Link to="/signup" className="mobile-menu-item" onClick={closeMobileMenu}>
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
