import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
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
