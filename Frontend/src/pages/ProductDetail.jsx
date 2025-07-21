"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../api/axios"
import "./ProductDetail.css"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching product:", err)
        setLoading(false)
      })
  }, [id])

  // Format full location display for product detail page
  const getFullLocationDisplay = () => {
    if (!product.location) return "Location not specified"

    const parts = []

    if (product.location.address) {
      return product.location.address
    }

    // Build address from components
    if (product.location.village) parts.push(product.location.village)
    if (product.location.city) parts.push(product.location.city)
    if (product.location.district) parts.push(product.location.district)
    if (product.location.state) parts.push(product.location.state)
    if (product.location.pincode) parts.push(product.location.pincode)
    if (product.location.country) parts.push(product.location.country)

    return parts.length > 0 ? parts.join(", ") : "Location not specified"
  }

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    )

  if (!product)
    return (
      <div className="not-found-container">
        <h2>Product Not Found</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Products
        </button>
      </div>
    )

  const isTransport = product.name === "Cars" || product.name === "Bikes"

  return (
    <div className="product-detail-page">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Products
      </button>

      <div className="product-detail-container">
        <div className="product-image-container">
          <img
            className="product-detail-image"
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            onError={(e) => {
              e.target.src = "/placeholder.svg"
            }}
          />
        </div>

        <div className="product-info-container">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-meta">
            <span className="product-brand">{product.category}</span>
            <span className="product-location">{getFullLocationDisplay()}</span>
          </div>

          <div className="price-section">
            <span className="price-label">Price:</span>
            <span className="product-price">₹{product.price.toLocaleString()}</span>
          </div>

          <div className="product-specs">
            {isTransport ? (
              <div className="spec-item">
                <span className="spec-label">Distance Travelled:</span>
                <span className="spec-value">{product.distance?.toLocaleString()} km</span>
              </div>
            ) : (
              <>
                <div className="spec-item">
                  <span className="spec-label">Used From:</span>
                  <span className="spec-value">{new Date(product.usedFrom).toLocaleDateString()}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Used To:</span>
                  <span className="spec-value">{new Date(product.usedTo).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>

          {product.postedBy && (
            <div className="seller-info">
              <h3>Seller Information</h3>
              <div className="spec-item">
                <span className="spec-label">Name:</span>
                <span className="spec-value">{product.postedBy.name}</span>
              </div>
              {product.postedBy.email && (
                <div className="spec-item">
                  <span className="spec-label">Email:</span>
                  <span className="spec-value">{product.postedBy.email}</span>
                </div>
              )}
              {product.postedBy.phoneNo && (
                <div className="spec-item">
                  <span className="spec-label">Contact:</span>
                  <span className="spec-value">+91-{product.postedBy.phoneNo}</span>
                </div>
              )}

              <div className={`availability-status ${product.availability ? "available" : "unavailable"}`}>
                {product.availability ? "Available for Sale" : "Currently Unavailable"}
              </div>

              {product.postedBy.phoneNo && (
                <>
                  <div className="contact-buttons">
                    <a
                      className="whatsapp-btn"
                      href={`https://wa.me/91${product.postedBy.phoneNo}?text=Hi%20${encodeURIComponent(
                        product.postedBy.name,
                      )}!%20I'm%20interested%20in%20your%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.category)})%20listed%20for%20₹${product.price.toLocaleString()}.%20Is%20it%20still%20available?`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp Seller
                    </a>
                    <a className="call-btn" href={`tel:+91${product.postedBy.phoneNo}`}>
                      Call Now
                    </a>
                  </div>

                  <div className="quick-contact-info">
                    <p>💬 Click WhatsApp for instant messaging or call directly!</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
