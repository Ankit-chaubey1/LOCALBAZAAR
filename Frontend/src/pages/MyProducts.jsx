import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import "./MyProducts.css";

const MyProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products/user/my")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  return (
    <div className="my-products-container">
      <h2>My Products</h2>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products uploaded yet.</p>
      )}
    </div>
  );
};

export default MyProducts;
