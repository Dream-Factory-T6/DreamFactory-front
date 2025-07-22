import React from 'react';
import styles from './styles.module.css';

function DeleteDestinationModal({ destination, loading, error, success, onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onCancel} className={styles.modalClose}>&times;</button>
        <h2 className={styles.modalTitle}>Delete Destination</h2>
        <div className={styles.modalQuestion}>
          Are you sure you want to delete <b>{destination.title}</b>?
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Destination deleted successfully!</div>}
        <div className={styles.buttonRow}>
          <button onClick={onConfirm} disabled={loading} className={styles.modalButton}>Yes</button>
          <button onClick={onCancel} className={styles.modalButtonCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteDestinationModal; 