"use client"

import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import API from "../api/axios"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import "./Cart.css"

const Cart = () => {
  const { user } = useContext(AuthContext)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchCart = async () => {
    try {
      const response = await API.get("/cart")
      setCartItems(response.data)
    } catch (error) {
      toast.error("Failed to fetch cart items")
      console.error("Cart fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/remove/${productId}`)
      setCartItems(cartItems.filter((item) => item._id !== productId))
      toast.success("Product removed from cart")
    } catch (error) {
      toast.error("Failed to remove product from cart")
    }
  }

  const clearCart = async () => {
    try {
      await API.delete("/cart/clear")
      setCartItems([])
      toast.success("Cart cleared successfully")
    } catch (error) {
      toast.error("Failed to clear cart")
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0)
  }

  // Format location display for cart items - show only city, state, country
  const getLocationDisplay = (location) => {
    const parts = []

    if (location?.city) {
      parts.push(location.city)
    }

    if (location?.state) {
      parts.push(location.state)
    }

    if (location?.country && location.country !== "India") {
      parts.push(location.country)
    }

    if (parts.length > 0) {
      return parts.join(", ")
    }

    if (location?.address) {
      const addressParts = location.address.split(",")
      if (addressParts.length >= 2) {
        return addressParts
          .slice(-2)
          .map((part) => part.trim())
          .join(", ")
      }
      return location.address
    }

    return "Location not specified"
  }

  if (!user) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>Please Login</h2>
          <p>You need to be logged in to view your cart.</p>
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading">Loading cart...</div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>My Cart ({cartItems.length} items)</h2>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <h3>Your cart is empty</h3>
          <p>Browse products and add them to your cart!</p>
          <Link to="/" className="browse-btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-location">{getLocationDisplay(item.location)}</p>
                  <p className="cart-item-seller">Seller: {item.postedBy?.name}</p>
                </div>
                <div className="cart-item-actions">
                  <span className="cart-item-price">₹{item.price.toLocaleString()}</span>
                  <Link to={`/product/${item._id}`} className="view-product-btn">
                    View Details
                  </Link>
                  <button onClick={() => removeFromCart(item._id)} className="remove-btn">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="total-section">
              <h3>Total: ₹{getTotalPrice().toLocaleString()}</h3>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
