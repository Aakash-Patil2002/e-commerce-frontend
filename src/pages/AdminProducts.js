import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { PackagePlus, Edit2, Trash2 } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', isActive: true });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await api.get('/product/listing?limit=100');
      setProducts(response.data.data.rows || []);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(''); setSuccess('');
      if (editId) {
        await api.put(`/product/${editId}`, formData);
        setSuccess('Product updated successfully!');
      } else {
        await api.post('/product', formData);
        setSuccess('Product created successfully!');
      }
      setFormData({ name: '', price: '', description: '', isActive: true });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (prod) => {
    setEditId(prod.product_id || prod.id);
    setFormData({
      name: prod.name,
      price: prod.price,
      description: prod.description || '',
      isActive: prod.isActive !== false
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/product/${id}`);
      setSuccess('Product deleted that');
      fetchProducts();
    } catch (err) {
      setError('Delete failed');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Admin Dashboard: Profile Data Entry</h2>
      
      <div className="glass-card" style={{ padding: '30px', marginBottom: '40px' }}>
        <h3 className="flex items-center gap-2 mb-4">
          <PackagePlus className="text-primary"/> {editId ? 'Edit Product' : 'Add New Product'}
        </h3>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}
        {success && <div style={{ color: '#10b981', marginBottom: '16px' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>
          <div className="form-group flex items-center" style={{ flexDirection: 'row', gap: '8px' }}>
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
            <label>Active Product</label>
          </div>
          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Create'} Product</button>
            {editId && (
              <button type="button" className="btn glass-card" onClick={() => { setEditId(null); setFormData({ name: '', price: '', description: '', isActive: true }); }}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>Existing Products</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Price</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.product_id || prod.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px' }}>{prod.name}</td>
                  <td style={{ padding: '12px' }}>${prod.price}</td>
                  <td style={{ padding: '12px' }}>{prod.isActive ? 'Active' : 'Inactive'}</td>
                  <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                    <button className="btn" style={{ padding: '6px 12px', background: 'var(--primary)', color: 'white' }} onClick={() => handleEdit(prod)}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button className="btn" style={{ padding: '6px 12px', background: 'var(--danger)', color: 'white' }} onClick={() => handleDelete(prod.product_id || prod.id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
