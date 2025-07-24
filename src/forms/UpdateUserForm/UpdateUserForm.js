import React, { useState } from 'react';
import styles from './styles.module.css';
import { fetchWithAuth } from '../../api';

function UpdateUserForm({ user, onClose, onSuccess }) {
  const [form, setForm] = useState({
    username: user.username || '',
    email: user.email || '',
    password: '',
    role: user.role === 'ADMIN' || user.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER',
  });
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
      const payload = { ...form };
      const response = await fetchWithAuth(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update user');
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
        <h2 className={styles.title}>UPDATE USER</h2>
        <div className={styles.currentInfoTitle}>CURRENT USER INFORMATION:</div>
        <div className={styles.currentInfoBlock}>
          <div className={styles.infoItem}><b>USERNAME:</b> {user.username}</div>
          <div className={styles.infoItem}><b>EMAIL:</b> {user.email}</div>
          <div className={styles.infoItem}><b>PASSWORD:</b> {'*'.repeat(8)}</div>
          <div className={styles.infoItem}><b>ROLE:</b> {user.roles}</div>
        </div>
        <hr className={styles.hr} />
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
          <button type="submit" className={styles.submitButton} disabled={loading}>UPDATE USER</button>
          {success && <div className={styles.success}>User was updated successfully !!!</div>}
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default UpdateUserForm;
