"use client"

import { Link } from "react-router-dom"
import "./ProductCard.css"
import { FaShoppingCart } from "react-icons/fa"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import API from "../api/axios"
import { toast } from "react-toastify"

const ProductCard = ({ product, showDistance = false }) => {
  const { user } = useContext(AuthContext)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const isTransport = product.name === "Cars" || product.name === "Bikes"

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add products to cart")
      return
    }

    setIsAddingToCart(true)
    try {
      await API.post("/cart/add", { productId: product._id })
      toast.success("Product added to cart!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Format location display - show only city, state, country
  const getLocationDisplay = () => {
    const parts = []

    if (product.location?.city) {
      parts.push(product.location.city)
    }

    if (product.location?.state) {
      parts.push(product.location.state)
    }

    if (product.location?.country && product.location.country !== "India") {
      parts.push(product.location.country)
    }

    // If we have city/state/country, join them with commas
    if (parts.length > 0) {
      return parts.join(", ")
    }

    // Fallback: if no city/state, try to extract from address
    if (product.location?.address) {
      // Try to extract city and state from address
      const addressParts = product.location.address.split(",")
      if (addressParts.length >= 2) {
        // Take the last 2-3 parts which usually contain city, state
        return addressParts
          .slice(-2)
          .map((part) => part.trim())
          .join(", ")
      }
      // If address is short, just show it
      return product.location.address
    }

    return "Location not specified"
  }

  return (
    <div className="product-card">
      <img src={product.image || "/placeholder.svg"} alt={product.category} className="product-img" />

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <div className="detail-row">
          <strong>Brand:</strong>
          <span>{product.category}</span>
        </div>

        {isTransport && (
          <div className="detail-row">
            <strong>Distance:</strong>
            <span>{product.distance} km</span>
          </div>
        )}

        {!isTransport && (
          <div className="detail-row">
            <strong>Used From:</strong>
            <span>{new Date(product.usedFrom).toLocaleDateString()}</span>
          </div>
        )}

        <div className="detail-row">
          <strong>Location:</strong>
          <span>{getLocationDisplay()}</span>
        </div>

        {showDistance && product.distanceFromUser && (
          <div className="distance-info">
            <strong>Distance from you:</strong>
            <span>{product.distanceFromUser} km</span>
          </div>
        )}

        <div className="price-row">
          <span className="price">₹{product.price.toLocaleString()}</span>
        </div>

        <div className="actions-row">
          <Link to={`/product/${product._id}`} className="view-btn">
            View
          </Link>
          <button className="cart-btn" onClick={handleAddToCart} disabled={isAddingToCart}>
            {isAddingToCart ? "Adding..." : <FaShoppingCart />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
