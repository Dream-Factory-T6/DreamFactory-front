import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import logo from '../../assets/images/header/logo.png';
import homeIcon from '../../assets/images/header/homepage-logo.png';
import loginIcon from '../../assets/images/header/login-logo.png';
import registerIcon from '../../assets/images/header/registration-logo.png';
import myAccountIcon from '../../assets/images/header/myaccount-logo.png';
import adminIcon from '../../assets/images/header/admin-logo.png';
import addIcon from '../../assets/images/header/add-logo.png';
import logoutIcon from '../../assets/images/header/logout-logo.png';
import LogoutConfirmationModal from '../../forms/LogoutConfirmationModal';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    return Boolean(token && !isTokenExpired(token));
  });
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'user');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(Boolean(token && !isTokenExpired(token)));
      setRole(localStorage.getItem('role') || 'user');
    };
    window.addEventListener('focus', checkAuth);
    checkAuth();
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    setShowLogoutModal(false);
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="Dream Factory Logo" />
            <h1>Where Dreams become Destination!</h1>
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            <img src={homeIcon} alt="Home" />
          </Link>
          {isLoggedIn ? (
            <>
              {role === 'admin' ? (
                <Link
                  to="/admin-dashboard"
                  className={`${styles.navLink} ${isActive('/admin-dashboard') ? styles.active : ''}`}
                >
                  <img src={adminIcon} alt="Admin" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/user-account"
                    className={`${styles.navLink} ${isActive('/user-account') ? styles.active : ''}`}
                  >
                    <img src={myAccountIcon} alt="My Account" />
                  </Link>
                  <Link
                    to="/add"
                    className={styles.navLink}
                  >
                    <img src={addIcon} alt="Add" />
                  </Link>
                </>
              )}
              <Link
                to="/logout"
                className={styles.navLink}
                onClick={handleLogoutClick}
              >
                <img src={logoutIcon} alt="Logout" />
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`${styles.navLink} ${isActive('/login') ? styles.active : ''}`}
              >
                <img src={loginIcon} alt="Login" />
              </Link>
              <Link 
                to="/register" 
                className={`${styles.navLink} ${isActive('/register') ? styles.active : ''}`}
              >
                <img src={registerIcon} alt="Register" />
              </Link>
            </>
          )}
        </nav>
      </header>
      {showLogoutModal && (
        <LogoutConfirmationModal
          loading={false}
          error={null}
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </>
  );
}

export default Header;

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}
