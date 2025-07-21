import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDestinationById } from '../../api';
import styles from './styles.module.css';

function DestinationDetails() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchDestinationById(id)
      .then(data => {
        setDestination(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load destination');
        setLoading(false);
      });
  }, [id]);

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return <div className={styles.container}>Loading destination details...</div>;
  }

  if (error) {
    return <div className={styles.container} style={{ color: 'red' }}>{error}</div>;
  }

  if (!destination) {
    return (
      <div className={styles.notFound}>
        <h2>Destination not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.destinationCard}>
          <div className={styles.cardImage}>
            {destination.imageUrl && (
              <img src={destination.imageUrl} alt={destination.title || destination.name} />
            )}
          </div>
          <div className={styles.cardContent}>
            <div className={styles.destinationNameContainer}>
              <h1 className={styles.destinationName}>{destination.title || destination.name}</h1>
              <div className={styles.rating}>
                <span className={styles.ratingValue}>{typeof destination.rating === 'number' ? destination.rating.toFixed(1) : 'N/A'}</span>
                <span className={styles.stars}>{renderStars(destination.rating || 0)}</span>
              </div>
            </div>
            <p className={styles.destinationLocation}>{destination.location}</p>
            <p className={styles.description}>{destination.description}</p>
            <p className={styles.postedBy}>Posted by: {destination.username}</p>
          </div>
        </div>
        <div className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Reviews:</h2>
          {Array.isArray(destination.reviews) && destination.reviews.length > 0 ? (
            destination.reviews.map((review) => (
              <div className={styles.review} key={review.id}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewUser}>{review.username}</span>
                  <span className={styles.reviewStars}>{renderStars(review.rating)}</span>
                </div>
                <p className={styles.reviewText}>{review.body}</p>
              </div>
            ))
          ) : (
            <div style={{ color: '#888', marginBottom: '10px' }}>No reviews yet.</div>
          )}
          <p className={styles.loginPrompt}>
            <Link to="/login" className={styles.loginLink}>Login</Link> or{' '}
            <Link to="/register" className={styles.registerLink}>Register</Link> to write a review.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetails;
