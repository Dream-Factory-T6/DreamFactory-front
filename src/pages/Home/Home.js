import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';


const tajMahal = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop';
const paradiseBeach = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
const santorini = 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop';
const newYork = 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop';

function Home() {
  const [locationSearch, setLocationSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const navigate = useNavigate();

  const destinations = [
    {
      id: 1,
      name: 'Taj Mahal',
      location: 'Agra, India',
      rating: 5.0,
      image: tajMahal,
      description: 'Iconic white marble mausoleum'
    },
    {
      id: 2,
      name: 'Paradise Beach',
      location: 'Bali, Indonesia',
      rating: 5.0,
      image: paradiseBeach,
      description: 'Tropical paradise with crystal clear waters'
    },
    {
      id: 3,
      name: 'Santorini Sunset',
      location: 'Santorini, Greece',
      rating: 5.0,
      image: santorini,
      description: 'Breathtaking sunset views over white buildings'
    },
    {
      id: 4,
      name: 'New York City',
      location: 'New York, USA',
      rating: 5.0,
      image: newYork,
      description: 'The city that never sleeps'
    }
  ];

  const filteredDestinations = destinations.filter(destination => {
    const matchesLocation = destination.location.toLowerCase().includes(locationSearch.toLowerCase());
    const matchesName = destination.name.toLowerCase().includes(nameSearch.toLowerCase());
    return matchesLocation && matchesName;
  });

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
        <div className={styles.destinations}>
          {filteredDestinations.map(destination => (
            <div 
              key={destination.id} 
              className={styles.destinationCard}
              onClick={() => handleCardClick(destination.id)}
            >
              <div className={styles.cardImage}>
                <img src={destination.image} alt={destination.name} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.destinationName}>{destination.name}</h3>
                <div className={styles.destinationDescription}>
                <p className={styles.destinationLocation}>{destination.location}</p>
                <div className={styles.rating}>
                  <span className={styles.ratingValue}>{destination.rating.toFixed(1)}</span>
                    <span className={styles.stars}>{renderStars(destination.rating)}</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;