import React, { useState } from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { validateRegistrationForm } from '../../utils/validation';

function RegistrationPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
        
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setError(null);
    setErrors({});
    setIsSubmitting(true);
    
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Registration failed.');
      }
      const loginResponse = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
        credentials: 'include',
      });
      if (!loginResponse.ok) {
        throw new Error('Registration succeeded, but login failed.');
      }
      const loginData = await loginResponse.json();
      localStorage.setItem('token', loginData.token);
      if (loginData.refreshToken) {
        localStorage.setItem('refreshToken', loginData.refreshToken);
      }
      window.dispatchEvent(new Event('focus'));
      navigate('/user-account');
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.registrationContainer}>
      <h1 className={styles.registrationTitle}>REGISTRATION</h1>
      <div className={styles.registrationForm}>
        <form onSubmit={handleSubmit} className={styles.form} onKeyPress={handleKeyPress}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>USERNAME</label>
            <input 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`} 
              placeholder="Enter your username"
              required 
            />
            {errors.username && <div className={styles.fieldError}>{errors.username}</div>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>EMAIL</label>
            <input 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`} 
              placeholder="Enter your email"
              required 
            />
            {errors.email && <div className={styles.fieldError}>{errors.email}</div>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>PASSWORD</label>
            <input 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`} 
              placeholder="Enter your password"
              required 
            />
            {errors.password && <div className={styles.fieldError}>{errors.password}</div>}
          </div>
          {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
          <button 
            type="submit" 
            className={`${styles.registerButton} ${isSubmitting ? styles.submitting : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'REGISTERING...' : 'REGISTER'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
