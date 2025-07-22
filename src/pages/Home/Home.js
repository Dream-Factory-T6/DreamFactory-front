import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { fetchDestinations } from '../../api';


function Home() {
  const [locationSearch, setLocationSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setLoading(true);
    setError(null); 
    const size = 1000; 
    fetchDestinations(1, size)
      .then(data => {
        setDestinations(data.content || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load destinations');
        setLoading(false);
      });
  }, [locationSearch, nameSearch]);

  const filteredDestinations = destinations.filter(destination => {
    const matchesLocation = locationSearch
      ? destination.location?.toLowerCase().includes(locationSearch.toLowerCase())
      : true;
    const nameField = destination.title || destination.name || '';
    const matchesName = nameSearch
      ? nameField.toLowerCase().includes(nameSearch.toLowerCase())
      : true;
    return matchesLocation && matchesName;
  });

  const pageCount = Math.ceil(filteredDestinations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDestinations = filteredDestinations.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(1);
    }
  }, [filteredDestinations, pageCount, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [locationSearch, nameSearch]);

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const handleCardClick = (destinationId) => {
    navigate(`/destination/${destinationId}`);
  };

  return (
    <div className={styles.homeContainer}>
      <aside className={styles.searchSidebar}>
        <div className={styles.searchSection}>
          <label htmlFor="locationSearch">FIND BY LOCATION:</label>
          <input
            type="text"
            id="locationSearch"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Enter location..."
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.searchSection}>
          <label htmlFor="nameSearch">FIND BY NAME:</label>
          <input
            type="text"
            id="nameSearch"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            placeholder="Enter destination name..."
            className={styles.searchInput}
          />
        </div>
      </aside>

      <div className={styles.verticalDivider}></div>

      <main className={styles.mainContent}>
        {loading && <div>Loading destinations...</div>}
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.destinations}>
          {!loading && !error && filteredDestinations.length === 0 && (
            <div className={styles.empty}>
              No destinations found matching your search.
            </div>
          )}
          {!loading && !error && paginatedDestinations.map(destination => (
            <div 
              key={destination.id} 
              className={styles.destinationCard}
              onClick={() => handleCardClick(destination.id)}
            >
              <div className={styles.cardImage}>
                {destination.imageUrl && typeof destination.imageUrl === 'string' && destination.imageUrl.startsWith('http') && (
                  <img src={destination.imageUrl} alt={destination.title || destination.name} />
                )}
                <div>
                  <small>{destination.imageUrl}</small>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.destinationName}>{destination.title || destination.name}</h3>
                <div className={styles.destinationDescription}>
                  <p className={styles.destinationLocation}>{destination.location}</p>
                  <div className={styles.rating}>
                    <span className={styles.ratingValue}>{typeof destination.rating === 'number' ? destination.rating.toFixed(1) : 'N/A'}</span>
                    <span className={styles.stars}>{renderStars(destination.rating || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination controls */}
        {!loading && !error && pageCount > 1 && (
          <div className={styles.paginationContainer}>
            {Array.from({ length: pageCount }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={
                  currentPage === idx + 1
                    ? `${styles.paginationButton} ${styles.paginationButtonActive}`
                    : styles.paginationButton
                }
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;