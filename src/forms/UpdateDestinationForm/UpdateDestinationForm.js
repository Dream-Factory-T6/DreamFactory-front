import React, { useState } from 'react';
import styles from './styles.module.css';
import { fetchWithAuth } from '../../api';
import { validateDestinationForm } from '../../utils/validation';

function UpdateDestinationForm({ destination, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: destination.title || '',
    location: destination.location || '',
    description: destination.description || '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setErrors({});
    
    const validation = validateDestinationForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmitting(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('location', form.location);
      formData.append('description', form.description);
      if (form.image) formData.append('image', form.image);
      const response = await fetchWithAuth(`/api/destinations/${destination.id}`, {
        method: 'PUT',
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
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`} 
            />
            {errors.title && <div className={styles.fieldError}>{errors.title}</div>}
          </label>
          <label>
            LOCATION:
            <input 
              name="location" 
              value={form.location} 
              onChange={handleChange} 
              className={`${styles.input} ${errors.location ? styles.inputError : ''}`} 
            />
            {errors.location && <div className={styles.fieldError}>{errors.location}</div>}
          </label>
          <label>
            DESCRIPTION:
            <input 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              className={`${styles.input} ${errors.description ? styles.inputError : ''}`} 
            />
            {errors.description && <div className={styles.fieldError}>{errors.description}</div>}
          </label>
          <label>
            IMAGE:
            <input 
              name="image" 
              type="file" 
              accept="image/*" 
              onChange={handleChange} 
              className={`${styles.fileInput} ${errors.image ? styles.inputError : ''}`} 
            />
            {errors.image && <div className={styles.fieldError}>{errors.image}</div>}
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
