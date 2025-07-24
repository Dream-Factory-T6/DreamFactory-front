import React, { useState } from 'react';
import styles from './styles.module.css';
import { fetchWithAuth } from '../../api';

function AddUserForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
        <h2 className={styles.title}>ADD USER</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>USERNAME:
            <input name="username" value={form.username} onChange={handleChange} className={styles.input} required />
          </label>
          <label>EMAIL:
            <input name="email" value={form.email} onChange={handleChange} className={styles.input} required />
          </label>
          <label>PASSWORD:
            <input name="password" type="password" value={form.password} onChange={handleChange} className={styles.input} required />
          </label>
          <label>ROLE:
            <select name="role" value={form.role} onChange={handleChange} className={styles.input} required>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <button type="submit" className={styles.submitButton} disabled={loading}>ADD USER</button>
          {success && <div className={styles.success}>User was added successfully !!!</div>}
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default AddUserForm;
