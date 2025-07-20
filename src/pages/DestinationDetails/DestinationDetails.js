import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './styles.module.css';

function DestinationDetails() {
  const { id } = useParams();

  const destinationData = {
    1: {
      name: 'Taj Mahal',
      location: 'Agra, India',
      rating: 5.0,
      description: 'Iconic white marble mausoleum. A UNESCO World Heritage site and one of the most beautiful buildings in the world.',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
      postedBy: 'Sarah'
    },
    2: {
      name: 'Paradise Beach',
      location: 'Bali, Indonesia',
      rating: 5.0,
      description: 'Tropical paradise with crystal clear waters. Perfect for swimming, snorkeling, and relaxing on pristine white sand.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      postedBy: 'Maria'
    },
    3: {
      name: 'Santorini Sunset',
      location: 'Santorini, Greece',
      rating: 5.0,
      description: 'Breathtaking sunset views over white buildings. Experience the magic of Greek islands and Mediterranean charm.',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
      postedBy: 'Alex'
    },
    4: {
      name: 'New York City',
      location: 'New York, USA',
      rating: 5.0,
      description: 'The city that never sleeps. Broadway shows, world-class museums, and iconic landmarks like Times Square.',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
      postedBy: 'David'
    }
  };

  const destination = destinationData[id];

  if (!destination) {
    return (
      <div className={styles.notFound}>
        <h2>Destination not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className={styles.mainContainer}>
    <div className={styles.container}>
      <div className={styles.destinationCard}>
        <div className={styles.cardImage}>
          <img src={destination.image} alt={destination.name} />
        </div>
        
          <div className={styles.cardContent}>
            <div className={styles.destinationNameContainer}>
            <h1 className={styles.destinationName}>{destination.name}</h1>
            <div className={styles.rating}>
            <span className={styles.ratingValue}>{destination.rating.toFixed(1)}</span>
            <span className={styles.stars}>{renderStars(destination.rating)}</span>
              </div>
              </div>
          <p className={styles.destinationLocation}>{destination.location}</p>
          <p className={styles.description}>{destination.description}</p>
          <p className={styles.postedBy}>Posted by: {destination.postedBy}</p>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <h2 className={styles.reviewsTitle}>Reviews:</h2>
        <div className={styles.review}>
          <div className={styles.reviewHeader}>
            <span className={styles.reviewUser}>john_doe</span>
            <span className={styles.reviewStars}>{renderStars(5.0)}</span>
          </div>
          <p className={styles.reviewText}>The energy of the city is incredible! Broadway shows are a must.</p>
        </div>

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
