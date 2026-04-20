import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product/listing?limit=1000");
        setProducts(response.data?.data?.rows || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: "20px 0" }}>
      <header style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            background:
              "linear-gradient(to right, var(--primary), var(--accent))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Discover Amazing Products
        </h1>
        <p style={{ marginTop: "10px", color: "var(--text-muted)" }}>
          Scroll through our collection seamlessly.
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          No products found.
        </div>
      ) : (
        <div style={{ height: "70vh", width: "100%", overflowY: "auto" }}>
          {products
            .filter((product) => product?.isActive)
            .map((product) => (
              <div
                key={product.product_id || product.id}
                style={{ paddingBottom: "20px", paddingRight: "10px" }}
              >
                <div
                  className="glass-card flex items-center justify-between"
                  style={{ padding: "20px", height: "100%" }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 600,
                        color: "var(--primary)",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        marginTop: "8px",
                        maxWidth: "600px",
                      }}
                    >
                      {product.description}
                    </p>
                    <div
                      style={{
                        marginTop: "16px",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      }}
                    >
                      ${Number(product.price).toFixed(2)}
                    </div>
                  </div>

                  <button
                    className="btn btn-accent"
                    onClick={() =>
                      addToCart(product.product_id || product.id, 1)
                    }
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Home;
