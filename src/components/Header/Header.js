import React from 'react';

import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import logo from '../../assets/images/header/logo.png';
import homeIcon from '../../assets/images/header/homepage-logo.png';
import loginIcon from '../../assets/images/header/login-logo.png';
import registerIcon from '../../assets/images/header/registration-logo.png';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="Dream Factory Logo" />
          <h1>Where Dreams become Destination!</h1>
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}><img src={homeIcon} alt="Home" /></Link>
        <Link to="/login" className={styles.navLink}><img src={loginIcon} alt="Login" /></Link>
        <Link to="/register" className={styles.navLink}><img src={registerIcon} alt="Register" /></Link>
</nav>
      
      {/* Add navigation or branding here */}
    </header>
  );
}

export default Header;
