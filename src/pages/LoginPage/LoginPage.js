import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { validateLoginForm } from '../../utils/validation';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
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

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Login failed. Please check your username and password.');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      } else {
      }

      let role = 'user';
      let authoritiesRaw = data.authorities;
      let authorities = [];

      if (authoritiesRaw) {
        try {
          if (typeof authoritiesRaw === 'string') {
            authorities = JSON.parse(authoritiesRaw);
          } else if (Array.isArray(authoritiesRaw)) {
            authorities = authoritiesRaw;
          }
          if (Array.isArray(authorities) && authorities.some(a => a.authority === 'ROLE_ADMIN')) {
            role = 'admin';
          }
        } catch (e) {
        }
      }

      try {
        const token = data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));


        let foundAdmin = false;
        if (payload && payload.authorities) {
          let authoritiesArr = [];
          if (typeof payload.authorities === 'string') {
            try {
              authoritiesArr = JSON.parse(payload.authorities);
            } catch (e) {
              authoritiesArr = [];
            }
          } else if (Array.isArray(payload.authorities)) {
            authoritiesArr = payload.authorities;
          }
          if (authoritiesArr.some(a => a.authority === 'ROLE_ADMIN')) {
            foundAdmin = true;
          }
        }
        if (
          foundAdmin ||
          (payload && payload.role && (payload.role === 'ADMIN' || payload.role === 'ROLE_ADMIN')) ||
          (payload && payload.roles && Array.isArray(payload.roles) && payload.roles.some(r => r === 'ADMIN' || r === 'ROLE_ADMIN'))
        ) {
          role = 'admin';
        }
      } catch (err) {
      }

      localStorage.setItem('role', role);
      window.dispatchEvent(new Event('focus'));
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-account');
      }
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
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>LOGIN</h1>
      <div className={styles.loginForm}>
        <form onSubmit={handleSubmit} className={styles.form} onKeyPress={handleKeyPress}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>USERNAME</label>
            <input
              type="text"
              id="username"
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
            <label htmlFor="password" className={styles.label}>PASSWORD</label>
            <input
              type="password"
              id="password"
              name="password"
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
            className={`${styles.loginButton} ${isSubmitting ? styles.submitting : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <p className={styles.registerLink}>
          Don't have an account? <Link to="/register" className={styles.link}>Register!</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
