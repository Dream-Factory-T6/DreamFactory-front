import React, { useState } from 'react';
import styles from './styles.module.css';
import { fetchWithAuth } from '../../api';
import { validateUserForm } from '../../utils/validation';

function AddUserForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'USER' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    setErrors({});
      
    const validation = validateUserForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetchWithAuth('/register/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Failed to add user');
      setSuccess(true);
      onSuccess && onSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose && onClose();
      }, 1200);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
        <h2 className={styles.title}>ADD USER</h2>
        <form onSubmit={handleSubmit} className={styles.form} onKeyPress={handleKeyPress}>
          <label>USERNAME:
            <input 
              name="username" 
              value={form.username} 
              onChange={handleChange} 
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`} 
              required 
            />
            {errors.username && <div className={styles.fieldError}>{errors.username}</div>}
          </label>
          <label>EMAIL:
            <input 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`} 
              required 
            />
            {errors.email && <div className={styles.fieldError}>{errors.email}</div>}
          </label>
          <label>PASSWORD:
            <input 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={handleChange} 
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`} 
              required 
            />
            {errors.password && <div className={styles.fieldError}>{errors.password}</div>}
          </label>
          <label>ROLE:
            <select name="role" value={form.role} onChange={handleChange} className={styles.input} required>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <button 
            type="submit" 
            className={`${styles.submitButton} ${loading ? styles.submitting : ''}`} 
            disabled={loading}
          >
            {loading ? 'ADDING USER...' : 'ADD USER'}
          </button>
          {success && <div className={styles.success}>User was added successfully !!!</div>}
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default AddUserForm;
