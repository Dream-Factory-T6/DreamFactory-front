import React from 'react';
import styles from './styles.module.css';

function DeleteUserModal({ user, loading, error, success, onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onCancel} className={styles.modalClose}>&times;</button>
        <h2 className={styles.modalTitle}>Delete User</h2>
        <div className={styles.modalQuestion}>
          Are you sure you want to delete <b>{user.username}</b>?
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>User deleted successfully!</div>}
        <div className={styles.buttonRow}>
          <button onClick={onConfirm} disabled={loading} className={styles.modalButton}>Yes</button>
          <button onClick={onCancel} className={styles.modalButtonCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserModal; 