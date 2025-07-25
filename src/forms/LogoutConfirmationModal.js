import React from 'react';
import styles from './DeleteDestinationModal/styles.module.css';

function LogoutConfirmationModal({ loading, error, onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onCancel} className={styles.modalClose}>&times;</button>
        <h2 className={styles.modalTitle}>Log Out</h2>
        <div className={styles.modalQuestion}>
          Are you sure you want to log out?
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.buttonRow}>
          <button onClick={onConfirm} disabled={loading} className={styles.modalButton}>Yes</button>
          <button onClick={onCancel} className={styles.modalButtonCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmationModal; 