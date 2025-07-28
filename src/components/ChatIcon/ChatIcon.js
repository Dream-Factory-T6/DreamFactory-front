import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

function ChatIcon({ onOpenChat }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = Date.now() >= payload.exp * 1000;
          setIsVisible(!isExpired);
        } catch (error) {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === null) {
        checkAuth();
      }
    };

    const handleLogout = () => {
      setIsVisible(false);
    };

    checkAuth();
    
    window.addEventListener('storage', handleStorageChange);
    
    window.addEventListener('focus', checkAuth);
    
    window.addEventListener('logout', handleLogout);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkAuth);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.chatIconContainer}>
      <button 
        className={styles.chatIconButton}
        onClick={onOpenChat}
        title="Open Chat"
      >
        <svg 
          className={styles.chatIcon} 
          viewBox="0 0 24 24" 
          fill="currentColor"
          width="30" 
          height="30"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      </button>
    </div>
  );
}

export default ChatIcon; 