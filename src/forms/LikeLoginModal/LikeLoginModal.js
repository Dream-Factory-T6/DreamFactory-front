import React from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

function LikeLoginModal({ onClose }) {
  const navigate = useNavigate();
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.modalClose}>&times;</button>
        <h2 className={styles.modalTitle}>Want to like this destination?</h2>
        <p className={styles.modalMessage}>Please login or register.</p>
        <div className={styles.buttonRow}>
        <button onClick={() => { onClose(); navigate('/login'); }} className={styles.modalButton}>Login</button>
          <button onClick={() => { onClose(); navigate('/register'); }} className={styles.modalButton}>Register</button>
          </div>
      </div>
    </div>
  );
}

export default LikeLoginModal;