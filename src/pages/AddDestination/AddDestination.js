import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { fetchWithAuth } from '../../api';
import { validateDestinationForm } from '../../utils/validation';

function AddDestination() {
  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    if (name === 'image' && files && files[0]) {
      setImagePreview(URL.createObjectURL(files[0]));
    }
    if (name === 'image' && (!files || !files[0])) {
      setImagePreview(null);
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
      const response = await fetchWithAuth('/api/destinations', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to add destination');
      navigate('/user-account');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ADD DESTINATION:</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>TITLE:</label>
          <input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`} 
            required 
          />
          {errors.title && <div className={styles.fieldError}>{errors.title}</div>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>LOCATION:</label>
          <input 
            name="location" 
            value={form.location} 
            onChange={handleChange} 
            className={`${styles.input} ${errors.location ? styles.inputError : ''}`} 
            required 
          />
          {errors.location && <div className={styles.fieldError}>{errors.location}</div>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>DESCRIPTION:</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`} 
            rows={4} 
            required 
          />
          {errors.description && <div className={styles.fieldError}>{errors.description}</div>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>IMAGE:</label>
          <input 
            name="image" 
            type="file" 
            accept="image/*" 
            onChange={handleChange} 
            className={`${styles.inputFile} ${errors.image ? styles.inputError : ''}`} 
          />
          {errors.image && <div className={styles.fieldError}>{errors.image}</div>}
        </div>
        {imagePreview && (
          <div style={{ margin: '16px 0' }}>
            <img src={imagePreview} alt="Preview" className={styles.previewImage} />
          </div>
        )}
        <button type="submit" className={styles.submitButton} disabled={submitting}>ADD DESTINATION</button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export default AddDestination;
