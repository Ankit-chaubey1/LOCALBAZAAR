"use client"

import { useState } from "react"
import API from "../api/axios"
import { useNavigate } from "react-router-dom"
import LocationPicker from "../components/LocationPicker"
import "./AddEditProduct.css"
import { toast } from "react-toastify"

const AddEditProduct = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    usedFrom: "",
    usedTo: "",
    distance: "",
  })

  const [location, setLocation] = useState(null)
  const [image, setImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const productOptions = [
    "Cars",
    "Bikes",
    "Mobiles",
    "Laptops",
    "Furniture",
    "Clothing",
    "Books",
    "Appliances",
    "Accessories",
    "Real Estate",
    "Sports Equipment",
    "Toys",
  ]

  const isTransport = form.name === "Cars" || form.name === "Bikes"

  const handleLocationSelect = (locationData) => {
    console.log("Location selected:", locationData)
    setLocation(locationData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (!form.name || !form.category || !form.price || !form.usedFrom || !form.usedTo) {
        toast.error("Please fill in all required fields")
        return
      }

      if (!location) {
        toast.error("Please select a location")
        return
      }

      if (!location.latitude || !location.longitude) {
        toast.error("Please select a valid location with coordinates")
        return
      }

      if (!image) {
        toast.error("Please select an image for your product")
        return
      }

      if (isTransport && !form.distance) {
        toast.error("Please enter the distance travelled")
        return
      }

      // Create FormData
      const formData = new FormData()

      // Add basic fields
      formData.append("name", form.name.trim())
      formData.append("category", form.category.trim())
      formData.append("price", form.price.toString())
      formData.append("usedFrom", form.usedFrom)
      formData.append("usedTo", form.usedTo)
      formData.append("availability", "true")

      // Add distance only for transport items
      if (isTransport && form.distance) {
        formData.append("distance", form.distance.toString())
      }

      // Prepare location data - ensure all required fields are present
      const locationData = {
        address: location.address || `${location.city || "Selected Location"}, ${location.state || "Unknown"}`,
        city: location.city || "",
        state: location.state || "",
        country: location.country || "India",
        village: location.village || "",
        district: location.district || "",
        pincode: location.pincode || "",
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
      }

      formData.append("locationData", JSON.stringify(locationData))
      formData.append("image", image)

      // Debug: Log what we're sending
      console.log("Submitting form with data:")
      console.log("Form fields:", form)
      console.log("Location data:", locationData)
      console.log("Image:", image)

      const response = await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 201) {
        toast.success("Product added successfully!")
        navigate("/")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      console.error("Error response:", error.response?.data)

      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to add product. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Add Product</h2>

      <div className="form-group">
        <label>Product Type *</label>
        <select name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required>
          <option value="">Select Product Type</option>
          {productOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Brand Name *</label>
        <input
          placeholder="Enter brand name"
          name="category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Price (₹) *</label>
        <input
          placeholder="Enter price"
          name="price"
          type="number"
          min="1"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
      </div>

      <LocationPicker onLocationSelect={handleLocationSelect} />

      <div className="form-group">
        <label>Used From *</label>
        <input
          name="usedFrom"
          type="date"
          value={form.usedFrom}
          onChange={(e) => setForm({ ...form, usedFrom: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Used To *</label>
        <input
          name="usedTo"
          type="date"
          value={form.usedTo}
          onChange={(e) => setForm({ ...form, usedTo: e.target.value })}
          required
        />
      </div>

      {isTransport && (
        <div className="form-group">
          <label>Distance Travelled (km) *</label>
          <input
            placeholder="Enter distance in kilometers"
            name="distance"
            type="number"
            min="0"
            value={form.distance}
            onChange={(e) => setForm({ ...form, distance: e.target.value })}
            required
          />
        </div>
      )}

      <div className="form-group">
        <label>Product Image *</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
        {image && (
          <p style={{ fontSize: "0.9rem", color: "#28a745", marginTop: "0.5rem" }}>✓ Image selected: {image.name}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding Product..." : "Add Product"}
      </button>
    </form>
  )
}

export default AddEditProduct
