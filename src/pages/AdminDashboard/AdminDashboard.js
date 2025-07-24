import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import editIcon from '../../assets/images/destinations/update-icon.png';
import deleteIcon from '../../assets/images/destinations/delete-icon.png';
import AddUserForm from '../../forms/AddUserForm/AddUserForm';
import UpdateUserForm from '../../forms/UpdateUserForm/UpdateUserForm';
import DeleteUserModal from '../../forms/DeleteUserModal';
import { fetchWithAuth } from '../../api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [updateUser, setUpdateUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetchWithAuth('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const response = await fetchWithAuth(`/api/users/${deleteUser.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setDeleteSuccess(true);
      setTimeout(() => {
        setDeleteUser(null);
        setDeleteSuccess(false);
        fetchUsers();
      }, 1000);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.headerBar}>
        <span>Admin dashboard (authorised admin)</span>
      </div>
      <div className={styles.innerContainer}>
        <main className={styles.main}>
          <h2 className={styles.usersTitle}>Users list</h2>
          <button className={styles.addUserButton} onClick={() => setShowAddUser(true)}>ADD USER</button>
          <div className={styles.tableWrapper}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>id</th>
                  <th>username</th>
                  <th>email</th>
                  <th>password</th>
                  <th>role</th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>{getUserRole(user)}</td>
                    <td>
                      <img src={editIcon} alt="Edit" className={styles.actionIcon} onClick={() => setUpdateUser(user)} />
                      <img src={deleteIcon} alt="Delete" className={styles.actionIcon} onClick={() => setDeleteUser(user)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      {showAddUser && (
        <div className={styles.modalOverlay}>
          <AddUserForm onClose={() => setShowAddUser(false)} onSuccess={fetchUsers} />
        </div>
      )}
      {updateUser && (
        <div className={styles.modalOverlay}>
          <UpdateUserForm user={updateUser} onClose={() => setUpdateUser(null)} onSuccess={fetchUsers} />
        </div>
      )}
      {deleteUser && (
        <DeleteUserModal
          user={deleteUser}
          loading={deleteLoading}
          error={deleteError}
          success={deleteSuccess}
          onConfirm={handleDelete}
          onCancel={() => setDeleteUser(null)}
        />
      )}
    </div>
  );
}

function getUserRole(user) {
  if (Array.isArray(user.roles) && user.roles.includes('ADMIN')) return 'ADMIN';
  return 'USER';
}

export default AdminDashboard;
