import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          <Package className="text-primary" /> Aakash Patil Commerce
        </Link>
        <div className="nav-links">
          {user?.role === 'admin' && (
            <Link to="/admin/products" className="nav-link">Admin</Link>
          )}
          {user ? (
            <>
              <span className="nav-link" style={{ cursor: 'default', color: 'var(--primary)' }}>
                Hi, {user.name}
              </span>
              <Link to="/cart" className="nav-link flex items-center gap-2 relative">
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: 'var(--accent)', color: 'white', fontSize: '0.7rem',
                    padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold'
                  }}>
                    {cartItemCount}
                  </span>
                )}
                Cart
              </Link>
              <button onClick={handleLogout} className="btn" style={{ color: 'var(--danger)' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn glass-card">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
