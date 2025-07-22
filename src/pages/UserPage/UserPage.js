import React, { useEffect, useState, useCallback } from 'react';
import updateIcon from '../../assets/images/destinations/update-icon.png';
import deleteIcon from '../../assets/images/destinations/delete-icon.png';
import UpdateDestinationForm from '../../forms/UpdateDestinationForm/UpdateDestinationForm';
import DeleteDestinationModal from '../../forms/DeleteDestinationModal/DeleteDestinationModal';
import styles from './styles.module.css';

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

function UserPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('asc');
  const [updateModal, setUpdateModal] = useState(null); 
  const [deleteModal, setDeleteModal] = useState(null); 
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const token = localStorage.getItem('token');
  const user = parseJwt(token);
  const username = user?.username || user?.sub || 'User';

  const fetchMyDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/destinations/my-destinations?sort=${sort}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) {
        throw new Error('Failed to fetch your destinations');
      }
      const data = await response.json();
      setDestinations(data.content || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sort, token]);

  useEffect(() => {
    fetchMyDestinations();
  }, [sort, fetchMyDestinations]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/destinations/${deleteModal.id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to delete destination');
      setDeleteSuccess(true);
      setTimeout(() => {
        setDeleteModal(null);
        setDeleteSuccess(false);
        fetchMyDestinations();
      }, 1000);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className={styles.userPageContainer}>
      <div className={styles.welcome}>
        Welcome, {username}!
      </div>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarInner}>
          <label className={styles.sidebarLabel}>SORT BY CREATION DATE:</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className={styles.sidebarSelect}
          >
            <option value="asc">FROM EARLIEST TO LATEST</option>
            <option value="desc">FROM LATEST TO EARLIEST</option>
          </select>
        </div>
      </aside>
      <div className={styles.divider} />
      <main className={styles.main}>
        <h2 className={styles.title}>Your Destinations</h2>
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
        {!loading && !error && destinations.length === 0 && (
          <>
            <div className={styles.empty}>You have no destinations yet, but you can take the first step and create the destination of your dreams!</div>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <a href="/add" className={styles.addButton}>Add Destination</a>
            </div>
          </>
        )}
        <div className={styles.cards}>
          {destinations.map(dest => (
            <div key={dest.id} className={styles.card}>
              {dest.imageUrl && <img src={dest.imageUrl} alt={dest.name} className={styles.cardImage} />}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{dest.title}</h3>
                <div className={styles.cardDetails}>
                  <p className={styles.cardLocation}>{dest.location}</p>
                                <div className={styles.cardActions}>
                <img src={updateIcon} alt="Update" className={styles.actionIcon} onClick={() => setUpdateModal(dest)} />
                <img src={deleteIcon} alt="Delete" className={styles.actionIcon} onClick={() => setDeleteModal(dest)} />
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {updateModal && (
        <UpdateDestinationForm
          destination={updateModal}
          onClose={() => setUpdateModal(null)}
          onSuccess={fetchMyDestinations}
        />
      )}
      {deleteModal && (
        <DeleteDestinationModal
          destination={deleteModal}
          loading={deleteLoading}
          error={deleteError}
          success={deleteSuccess}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
}

export default UserPage;
