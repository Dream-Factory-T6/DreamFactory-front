import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
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
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>LOGIN</h1>
      <div className={styles.loginForm}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>USERNAME</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>PASSWORD</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
          <button type="submit" className={styles.loginButton}>
            LOGIN
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
