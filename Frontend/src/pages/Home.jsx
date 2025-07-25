import { useEffect, useState } from "react"
import API from "../api/axios"
import ProductCard from "../components/ProductCard"
import "./Home.css"

const Home = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [showNearby, setShowNearby] = useState(false)
  const [radius, setRadius] = useState(50)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadAllProducts()
  }, [])

  // Real-time search - triggers whenever searchQuery changes
  useEffect(() => {
    handleSearch()
  }, [searchQuery, products])

  const loadAllProducts = async () => {
    try {
      setLoading(true)
      const res = await API.get("/products")
      setProducts(res.data)
      setFilteredProducts(res.data)
    } catch (err) {
      console.error("Failed to load products", err)
    } finally {
      setLoading(false)
    }
  }

  const calculateSearchScore = (product, query) => {
    const searchFields = [
      { field: product.name || "", weight: 10 }, // Product name gets highest priority
      { field: product.category || "", weight: 8 }, // Brand gets second priority
      { field: product.location?.city || "", weight: 5 }, // City gets medium priority
      { field: product.location?.state || "", weight: 3 }, // State gets lower priority
    ]

    let maxScore = 0

    searchFields.forEach(({ field, weight }) => {
      const fieldLower = field.toLowerCase()
      const queryLower = query.toLowerCase()

      if (fieldLower === queryLower) {
        // Exact match gets maximum score
        maxScore = Math.max(maxScore, weight * 10)
      } else if (fieldLower.startsWith(queryLower)) {
        // Starts with query gets high score
        maxScore = Math.max(maxScore, weight * 8)
      } else if (fieldLower.includes(` ${queryLower}`)) {
        // Word boundary match gets medium score
        maxScore = Math.max(maxScore, weight * 6)
      } else if (fieldLower.includes(queryLower)) {
        // Contains query gets lower score
        maxScore = Math.max(maxScore, weight * 4)
      }
    })

    return maxScore
  }

  const handleSearch = () => {
    // If search is empty, show all products
    if (searchQuery.trim() === "") {
      setFilteredProducts(products)
      return
    }

    const query = searchQuery.trim()

    // Filter and score products
    const scoredProducts = products
      .map((product) => ({
        ...product,
        searchScore: calculateSearchScore(product, query),
      }))
      .filter((product) => product.searchScore > 0) // Only include products with matches
      .sort((a, b) => b.searchScore - a.searchScore) // Sort by score (highest first)

    setFilteredProducts(scoredProducts)
  }

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
    // Search happens automatically via useEffect
  }

  const clearSearch = () => {
    setSearchQuery("")
    // This will trigger useEffect and show all products
  }

  const loadNearbyProducts = async () => {
    if (!userLocation) {
      alert("Please allow location access to see nearby products")
      return
    }

    try {
      setLoading(true)
      const res = await API.get(
        `/products/nearby?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=${radius}`,
      )
      setProducts(res.data)
      setFilteredProducts(res.data)
      setShowNearby(true)
      setSearchQuery("")
    } catch (err) {
      console.error("Failed to load nearby products", err)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please enable location services.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  const resetToAllProducts = () => {
    setShowNearby(false)
    setSearchQuery("")
    loadAllProducts()
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>{showNearby ? "Nearby Products" : "Fresh Recommendations"}</h2>

        <div className="search-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="search-btn" style={{ background: "#dc3545" }}>
                ✕
              </button>
            )}
            {!searchQuery && (
              <button onClick={handleSearch} className="search-btn">
                🔍
              </button>
            )}
          </div>
        </div>

        <div className="location-controls">
          {!userLocation ? (
            <button onClick={getCurrentLocation} className="location-btn">
              📍 Enable Location
            </button>
          ) : (
            <div className="nearby-controls">
              <div className="radius-control">
                <label>Radius: </label>
                <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="radius-select">
                  <option value={10}>10 km</option>
                  <option value={25}>25 km</option>
                  <option value={50}>50 km</option>
                  <option value={100}>100 km</option>
                  <option value={200}>200 km</option>
                  <option value={300}>300 km</option>
                </select>
              </div>

              <button onClick={loadNearbyProducts} className="nearby-btn">
                🔍 Find Nearby
              </button>

              {showNearby && (
                <button onClick={resetToAllProducts} className="all-products-btn">
                  🌐 Show All
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {searchQuery && (
        <div className="search-results-info">
          <span>
            Found {filteredProducts.length} results for "{searchQuery}"
          </span>
          <button onClick={clearSearch} className="clear-search-btn">
            Clear
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} showDistance={showNearby} />
          ))}
        </div>
      ) : (
        <p className="no-products">
          {searchQuery
            ? `No products found for "${searchQuery}"`
            : showNearby
              ? "No products found in your area"
              : "No products available"}
        </p>
      )}
    </div>
  )
}

export default Home