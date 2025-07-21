"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import "./LocationPicker.css"

const LocationPicker = ({ onLocationSelect, initialLocation = null }) => {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const isInitializingRef = useRef(false)
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [isMapReady, setIsMapReady] = useState(false)
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false)
  const [inputMethod, setInputMethod] = useState("map") // "map" or "manual"
  const [manualLocation, setManualLocation] = useState({
    address: "",
    city: "",
    state: "",
    country: "India",
    village: "",
    district: "",
    pincode: "",
    latitude: "",
    longitude: "",
  })

  // Initialize manual location from initial location
  useEffect(() => {
    if (initialLocation) {
      setManualLocation({
        address: initialLocation.address || "",
        city: initialLocation.city || "",
        state: initialLocation.state || "",
        country: initialLocation.country || "India",
        village: initialLocation.village || "",
        district: initialLocation.district || "",
        pincode: initialLocation.pincode || "",
        latitude: initialLocation.latitude?.toString() || "",
        longitude: initialLocation.longitude?.toString() || "",
      })
    }
  }, [initialLocation])

  // Handle manual input changes
  const handleManualInputChange = (field, value) => {
    const updatedLocation = { ...manualLocation, [field]: value }
    setManualLocation(updatedLocation)

    // If we have coordinates, create location data
    if (updatedLocation.latitude && updatedLocation.longitude) {
      const locationData = {
        address: updatedLocation.address || `${updatedLocation.city}, ${updatedLocation.state}`,
        city: updatedLocation.city,
        state: updatedLocation.state,
        country: updatedLocation.country,
        village: updatedLocation.village,
        district: updatedLocation.district,
        pincode: updatedLocation.pincode,
        latitude: Number.parseFloat(updatedLocation.latitude),
        longitude: Number.parseFloat(updatedLocation.longitude),
      }
      setSelectedLocation(locationData)
      onLocationSelect(locationData)
    }
  }

  // Auto-fill coordinates when address is complete
  const handleAddressComplete = async () => {
    if (manualLocation.city && manualLocation.state && !manualLocation.latitude) {
      try {
        const query = `${manualLocation.city}, ${manualLocation.state}, ${manualLocation.country}`
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        )
        const data = await response.json()

        if (data && data.length > 0) {
          const result = data[0]
          const updatedLocation = {
            ...manualLocation,
            latitude: result.lat,
            longitude: result.lon,
            address: manualLocation.address || result.display_name,
          }
          setManualLocation(updatedLocation)

          const locationData = {
            address: updatedLocation.address,
            city: updatedLocation.city,
            state: updatedLocation.state,
            country: updatedLocation.country,
            village: updatedLocation.village,
            district: updatedLocation.district,
            pincode: updatedLocation.pincode,
            latitude: Number.parseFloat(updatedLocation.latitude),
            longitude: Number.parseFloat(updatedLocation.longitude),
          }
          setSelectedLocation(locationData)
          onLocationSelect(locationData)
        }
      } catch (error) {
        console.error("Error geocoding address:", error)
      }
    }
  }

  // Cleanup function - Fixed to prevent React DOM errors
  const cleanupMap = useCallback(() => {
    if (mapInstanceRef.current) {
      try {
        // Remove marker first
        if (markerRef.current) {
          try {
            mapInstanceRef.current.removeLayer(markerRef.current)
          } catch (e) {
            console.log("Marker cleanup error:", e)
          }
          markerRef.current = null
        }

        // Remove all event listeners
        mapInstanceRef.current.off()

        // Remove map instance
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      } catch (error) {
        console.log("Map cleanup error:", error)
        mapInstanceRef.current = null
      }
    }

    // Reset states
    setIsMapReady(false)
    isInitializingRef.current = false
  }, [])

  // Load Leaflet resources only when needed
  useEffect(() => {
    if (inputMethod !== "map") return

    const loadLeaflet = () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Load JS
      if (!window.L) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.onload = () => {
          setIsLeafletLoaded(true)
        }
        script.onerror = () => {
          console.error("Failed to load Leaflet")
        }
        document.head.appendChild(script)
      } else {
        setIsLeafletLoaded(true)
      }
    }

    loadLeaflet()
  }, [inputMethod])

  // Initialize map when switching to map mode
  useEffect(() => {
    if (inputMethod !== "map" || !isLeafletLoaded || !mapContainerRef.current || isInitializingRef.current) {
      return
    }

    // Don't reinitialize if map already exists
    if (mapInstanceRef.current) {
      setIsMapReady(true)
      return
    }

    const initializeMap = () => {
      if (!mapContainerRef.current || isInitializingRef.current) {
        return
      }

      isInitializingRef.current = true

      try {
        // Default to India center if no initial location
        const defaultLat = initialLocation?.latitude || 20.5937
        const defaultLng = initialLocation?.longitude || 78.9629

        // Create map instance
        const newMap = window.L.map(mapContainerRef.current, {
          center: [defaultLat, defaultLng],
          zoom: initialLocation ? 13 : 6,
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: true,
        })

        // Add tile layer
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(newMap)

        // Add marker if initial location exists
        if (initialLocation && initialLocation.latitude && initialLocation.longitude) {
          const newMarker = window.L.marker([initialLocation.latitude, initialLocation.longitude]).addTo(newMap)
          markerRef.current = newMarker
        }

        // Handle map clicks
        newMap.on("click", async (e) => {
          const { lat, lng } = e.latlng

          try {
            // Remove existing marker
            if (markerRef.current) {
              newMap.removeLayer(markerRef.current)
              markerRef.current = null
            }

            // Add new marker
            const newMarker = window.L.marker([lat, lng]).addTo(newMap)
            markerRef.current = newMarker

            // Get address from coordinates
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            )
            const data = await response.json()

            // Extract detailed address components
            const addressComponents = data.address || {}
            const locationData = {
              latitude: lat,
              longitude: lng,
              address: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
              city: addressComponents.city || addressComponents.town || addressComponents.municipality || "",
              state: addressComponents.state || "",
              country: addressComponents.country || "",
              village: addressComponents.village || "",
              district: addressComponents.state_district || addressComponents.county || "",
              pincode: addressComponents.postcode || "",
            }

            setSelectedLocation(locationData)
            onLocationSelect(locationData)
          } catch (error) {
            console.error("Error handling map click:", error)
          }
        })

        // Store map instance and set ready state
        mapInstanceRef.current = newMap
        setIsMapReady(true)
        isInitializingRef.current = false

        // Force resize after a short delay
        setTimeout(() => {
          if (newMap && mapContainerRef.current) {
            newMap.invalidateSize()
          }
        }, 100)
      } catch (error) {
        console.error("Error initializing map:", error)
        isInitializingRef.current = false
      }
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(initializeMap, 50)
    return () => clearTimeout(timeoutId)
  }, [isLeafletLoaded, initialLocation, onLocationSelect, inputMethod])

  // Handle method switching
  const handleMethodSwitch = (method) => {
    if (method !== inputMethod) {
      if (inputMethod === "map") {
        cleanupMap()
      }
      setInputMethod(method)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMap()
    }
  }, [cleanupMap])

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    if (!mapInstanceRef.current) {
      alert("Map is not ready yet. Please wait a moment.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        try {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lng], 13)

            // Remove existing marker
            if (markerRef.current) {
              mapInstanceRef.current.removeLayer(markerRef.current)
              markerRef.current = null
            }

            // Add new marker
            const newMarker = window.L.marker([lat, lng]).addTo(mapInstanceRef.current)
            markerRef.current = newMarker

            // Get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            )
            const data = await response.json()

            // Extract detailed address components
            const addressComponents = data.address || {}
            const locationData = {
              latitude: lat,
              longitude: lng,
              address: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
              city: addressComponents.city || addressComponents.town || addressComponents.municipality || "",
              state: addressComponents.state || "",
              country: addressComponents.country || "",
              village: addressComponents.village || "",
              district: addressComponents.state_district || addressComponents.county || "",
              pincode: addressComponents.postcode || "",
            }

            setSelectedLocation(locationData)
            onLocationSelect(locationData)
          }
        } catch (error) {
          console.error("Error getting current location:", error)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        alert("Unable to get your location. Please click on the map to select a location.")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }, [onLocationSelect])

  return (
    <div className="location-picker">
      <div className="location-picker-header">
        <h3>Select Location</h3>
        <div className="input-method-toggle" d>
          <button
            type="button"
            className={`toggle-btn ${inputMethod === "map" ? "active" : ""}`}
            onClick={() => handleMethodSwitch("map")}
          >
            🗺️ Use Map
          </button>
          <button
            type="button"
            className={`toggle-btn ${inputMethod === "manual" ? "active" : ""}`}
            onClick={() => handleMethodSwitch("manual")}
          >
            ✏️ Manual Input
          </button>
        </div>
      </div>

      {inputMethod === "map" ? (
        <>
          <div className="map-controls">
            <button type="button" id="current-location-btn" onClick={getCurrentLocation} className="current-location-btn" disabled={!isMapReady}>
              📍 Use Current Location
            </button>
          </div>

          <div className="map-wrapper">
            <div ref={mapContainerRef} className="map-container" style={{ height: "300px", width: "100%" }}>
              {!isMapReady && (
                <div className="map-loading">
                  <div className="loading-spinner"></div>
                  <p>{isLeafletLoaded ? "Initializing map..." : "Loading map resources..."}</p>
                </div>
              )}
            </div>
          </div>

          <p className="map-instruction">
            {isMapReady ? "Click on the map to select your product location" : "Please wait for the map to load..."}
          </p>
        </>
      ) : (
        <div className="manual-input-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Full Address"
              value={manualLocation.address}
              onChange={(e) => handleManualInputChange("address", e.target.value)}
              className="full-width"
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="City *"
              value={manualLocation.city}
              onChange={(e) => handleManualInputChange("city", e.target.value)}
              onBlur={handleAddressComplete}
              required
            />
            <input
              type="text"
              placeholder="State *"
              value={manualLocation.state}
              onChange={(e) => handleManualInputChange("state", e.target.value)}
              onBlur={handleAddressComplete}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="Village/Area"
              value={manualLocation.village}
              onChange={(e) => handleManualInputChange("village", e.target.value)}
            />
            <input
              type="text"
              placeholder="District"
              value={manualLocation.district}
              onChange={(e) => handleManualInputChange("district", e.target.value)}
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="Pincode"
              value={manualLocation.pincode}
              onChange={(e) => handleManualInputChange("pincode", e.target.value)}
            />
            <select value={manualLocation.country} onChange={(e) => handleManualInputChange("country", e.target.value)}>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          <div className="form-row">
            <input
              type="number"
              step="any"
              placeholder="Latitude (optional)"
              value={manualLocation.latitude}
              onChange={(e) => handleManualInputChange("latitude", e.target.value)}
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude (optional)"
              value={manualLocation.longitude}
              onChange={(e) => handleManualInputChange("longitude", e.target.value)}
            />
          </div>

          <p className="manual-instruction">
            * Required fields. Coordinates will be auto-filled when you enter city and state.
          </p>
        </div>
      )}

      {selectedLocation && (
        <div className="selected-location">
          <p>
            <strong>Selected Location:</strong>
          </p>
          <p className="address-text">{selectedLocation.address}</p>
          <p className="location-details">
            {selectedLocation.city && <span>City: {selectedLocation.city}</span>}
            {selectedLocation.state && <span>State: {selectedLocation.state}</span>}
            {selectedLocation.village && <span>Village: {selectedLocation.village}</span>}
          </p>
          <p className="coordinates-text">
            Coordinates: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  )
}

export default LocationPicker
