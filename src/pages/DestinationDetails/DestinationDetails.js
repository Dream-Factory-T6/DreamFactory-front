import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDestinationById, fetchWithAuth } from '../../api';
import styles from './styles.module.css';
import { FaHeart } from 'react-icons/fa';
import LikeLoginModal from '../../forms/LikeLoginModal/LikeLoginModal';

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

function DestinationDetails() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState({ rating: 0, body: '' });
  const [reviewError, setReviewError] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isAuth, setIsAuth] = useState(() => {
    const token = localStorage.getItem('token');
    return Boolean(token && !isTokenExpired(token));
  });
  const [likeInfo, setLikeInfo] = useState({ liked: false, likeCount: 0 });
  const [likeLoading, setLikeLoading] = useState(false);
  const [showLikeLoginModal, setShowLikeLoginModal] = useState(false);


  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuth(Boolean(token && !isTokenExpired(token)));
    };
    window.addEventListener('focus', checkAuth);
    checkAuth();
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
      setIsAuth(false);
    }
  }, []);

  const fetchDetails = useCallback(() => {
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

  useEffect(() => {
    fetchDetails();
  }, [id, fetchDetails]);

  useEffect(() => {
    async function fetchLikes() {
      try {
        const response = await fetchWithAuth(`/api/destinations/${id}/likes`);
        if (response.ok) {
          const data = await response.json();
          setLikeInfo({ liked: data.liked, likeCount: data.likeCount });
        }
      } catch {}
    }
    fetchLikes();
  }, [id]);

  const handleLikeToggle = async () => {
    if (!isAuth) {
      setShowLikeLoginModal(true);
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const response = await fetchWithAuth(`/api/destinations/${id}/likes/toggle`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setLikeInfo({ liked: data.liked, likeCount: data.likeCount });
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const renderStars = (rating, onClick) => {
    return (
      <span>
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            style={{ color: star <= rating ? '#FFD700' : '#ccc', fontSize: 22, cursor: onClick ? 'pointer' : 'default' }}
            onClick={onClick ? () => onClick(star) : undefined}
            data-testid={`star-${star}`}
          >★</span>
        ))}
      </span>
    );
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview(r => ({ ...r, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(false);
    if (!review.rating || review.rating < 0 || review.rating > 5) {
      setReviewError('Rating is required (0-5)');
      return;
    }
    if (!review.body || review.body.trim().length === 0) {
      setReviewError('Comment is required');
      return;
    }
    if (review.body.length > 300) {
      setReviewError('Comment must be at most 300 characters');
      return;
    }
    setReviewLoading(true);
    try {
      const response = await fetchWithAuth('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: Number(review.rating),
          body: review.body,
          destinationId: Number(id),
        }),
      });
      if (!response.ok) throw new Error('Failed to submit review');
      setReview({ rating: 0, body: '' });
      setReviewSuccess(true);
      fetchDetails();
      setTimeout(() => setReviewSuccess(false), 2000);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
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
              <div className={styles.likeRatingRow}>
                <div className={styles.rating}>
                  <span className={styles.ratingValue}>{typeof destination.rating === 'number' ? destination.rating.toFixed(1) : 'N/A'}</span>
                  <span className={styles.stars}>{renderStars(destination.rating || 0)}</span>
                </div>
              </div>
            </div>
            <p className={styles.destinationLocation}>{destination.location}</p>
            <p className={styles.description}>{destination.description}</p>
            <div className={styles.destinationInfoContainer}>
            <p className={styles.postedBy}>Posted by: {destination.username}</p>
              <div className={styles.likeContainer}>
                <span style={{ fontSize:20, marginLeft: 4 }}>{likeInfo.likeCount}</span>
            <span
                  className={`${styles.heartIcon} ${likeInfo.liked ? styles.liked : ''}`}
                  onClick={handleLikeToggle}
                  title={isAuth ? (likeInfo.liked ? 'Unlike' : 'Like') : 'Login to like'}
                  style={{ pointerEvents: 'auto', opacity: 1 }}
                  role="button"
                  aria-label="Like"
                >
                  <FaHeart />
                </span>
              </div>
              </div>
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
            <div className={styles.noReviews}>No reviews yet.</div>
          )}
          {(() => {
            const role = localStorage.getItem('role');
            if (role === 'admin') return null;
            if (isAuth) {
              return (
                <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
                  <div className={styles.reviewFormTitle}>Write a review:</div>
                  <div className={styles.reviewFormBody}>
                    <span>Rating:</span> {renderStars(review.rating, (star) => setReview(r => ({ ...r, rating: star })))}
                  <div className={styles.reviewFormBodyTextarea}>
                    <label htmlFor="review-body">Comment:</label>
                    <textarea
                      id="review-body"
                      name="body"
                      value={review.body}
                      onChange={handleReviewChange}
                      maxLength={300}
                      rows={3}
                      className={styles.reviewTextarea}
                    />
                    </div>
                    </div>
                  {reviewError && <div className={styles.reviewError}>{reviewError}</div>}
                  {reviewSuccess && <div className={styles.reviewSuccess}>Review submitted successfully!</div>}
                  <button type="submit" className={styles.submitButton} disabled={reviewLoading}>
                    SUBMIT REVIEW
                  </button>
                </form>
              );
            } else {
              return (
                <p className={styles.loginPrompt}>
                  <Link to="/login" className={styles.loginLink}>Login</Link> or{' '}
                  <Link to="/register" className={styles.registerLink}>Register</Link> to write a review.
                </p>
              );
            }
          })()}
        </div>
      </div>
      {showLikeLoginModal && (
        <LikeLoginModal onClose={() => setShowLikeLoginModal(false)} />
      )}
    </div>
  );
}

export default DestinationDetails;
