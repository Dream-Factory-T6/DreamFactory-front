import React, { useState } from 'react';
import styles from './styles.module.css';

function UpdateDestinationForm({ destination, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: destination.title || '',
    location: destination.location || '',
    description: destination.description || '',
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('location', form.location);
      formData.append('description', form.description);
      if (form.image) formData.append('image', form.image);
      const response = await fetch(`/api/destinations/${destination.id}`, {
        method: 'PUT',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update destination');
      setSuccess(true);
      onSuccess && onSuccess();
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
        <h2 className={styles.title}>UPDATE DESTINATION</h2>
        <div className={styles.currentInfo}>CURRENT DESTINATION INFORMATION:</div>
        <div className={styles.infoRow}>
          <div className={styles.infoBlock}>
            <div className={styles.infoItem}><b>TITLE:</b> {destination.title}</div>
            <div className={styles.infoItem}><b>LOCATION:</b> {destination.location}</div>
            <div className={styles.infoItem}><b>DESCRIPTION:</b> {destination.description}</div>
            <div className={styles.infoItem}><b>IMAGE:</b></div>
          </div>
          {destination.imageUrl && <img src={destination.imageUrl} alt="Current" className={styles.currentImage} />}
        </div>
        <hr className={styles.hr} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            TITLE:
            <input name="title" value={form.title} onChange={handleChange} className={styles.input} />
          </label>
          <label>
            LOCATION:
            <input name="location" value={form.location} onChange={handleChange} className={styles.input} />
          </label>
          <label>
            DESCRIPTION:
            <input name="description" value={form.description} onChange={handleChange} className={styles.input} />
          </label>
          <label>
            IMAGE:
            <input name="image" type="file" accept="image/*" onChange={handleChange} className={styles.fileInput} />
          </label>
          {form.image && <img src={URL.createObjectURL(form.image)} alt="Preview" className={styles.preview} />}
          <button type="submit" disabled={submitting} className={styles.submitButton}>
            UPDATE DESTINATION
          </button>
          {success && <div className={styles.success}>Destination was updated successfully !!!</div>}
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default UpdateDestinationForm;
