import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { ShoppingBag, Trash2, CheckCircle } from 'lucide-react';

const Cart = () => {
  const { cart, fetchCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/cart/item/${itemId}`);
      fetchCart();
    } catch (err) {
      console.error('Error removing item');
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      // First checkout the cart
      await api.post(`/cart/checkout/${user.user_id}`);  
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '60vh', flexDirection: 'column' }}>
        <CheckCircle size={64} className="text-primary mb-4" />
        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Thank you for shopping with us. This app excludes payment implementation.</p>
      </div>
    );
  }

  const items = cart?.CartItems || [];
  const totalPrice = items.reduce((acc, item) => acc + (item.quantity * Number(item.Product?.price || 0)), 0);

  return (
    <div className="animate-fade-in" style={{ padding: "20px 0" }}>
      <h2
        className="flex items-center gap-2"
        style={{ fontSize: "2rem", marginBottom: "30px" }}
      >
        <ShoppingBag className="text-primary" /> Your Cart
      </h2>

      {error && (
        <div
          style={{
            color: "var(--danger)",
            marginBottom: "16px",
            background: "rgba(239, 68, 68, 0.1)",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: "40px", textAlign: "center" }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>
            Your cart is currently empty.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 350px",
            gap: "30px",
            alignItems: "start",
          }}
        >
          <div className="glass-card" style={{ padding: "20px" }}>
            {items.map((item) => (
              <div
                key={item.cart_item_id}
                className="flex items-center justify-between"
                style={{
                  padding: "16px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                    {item.Product?.name}
                  </h4>
                  <p style={{ color: "var(--text-muted)" }}>
                    Qty: {item.quantity} x $
                    {Number(item.Product?.price || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    $
                    {(Number(item.Product?.price || 0) * item.quantity).toFixed(
                      2,
                    )}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={{ color: "var(--danger)" }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: "30px" }}>
            <h3
              style={{
                fontSize: "1.5rem",
                marginBottom: "20px",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "10px",
              }}
            >
              Summary
            </h3>
            <div className="flex justify-between items-center mb-4">
              <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
              <span style={{ fontWeight: "bold" }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span style={{ color: "var(--text-muted)" }}>Shipping</span>
              <span style={{ fontWeight: "bold" }}>Free</span>
            </div>
            <div
              className="flex justify-between items-center mt-4"
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "16px",
              }}
            >
              <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>Total</span>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "var(--primary)",
                }}
              >
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              className="btn btn-primary w-full mt-4"
              style={{ fontSize: "1.1rem", padding: "14px" }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
