// src/components/ManageUsers.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Users, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import './ManageUsers.css';

const API_BASE = 'http://localhost:5000/api/users';

export default function ManageUsers({ session }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Every request needs the admin's token attached, or the backend's
  // "protect" middleware will reject it with a 401.
  const authHeaders = {
    headers: { Authorization: `Bearer ${session.token}` },
  };

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(API_BASE, authHeaders);
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  }, [session.token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleRole = async (user) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`${API_BASE}/${user._id}/role`, { role: nextRole }, authHeaders);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name} (${user.email})? This cannot be undone.`)) {
      return;
    }
    try {
      await axios.delete(`${API_BASE}/${user._id}`, authHeaders);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="mu-panel">
      <div className="mu-header">
        <h3 className="mu-heading">
          <Users size={13} strokeWidth={2} />
          Manage Users
        </h3>
        <span className="mu-count">{users.length} accounts</span>
      </div>

      {error && <div className="mu-error">{error}</div>}

      <div className="mu-table-container">
        <table className="mu-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="mu-empty">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="mu-empty">No users found.</td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelf = user._id === session._id;
                return (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td className="mu-cell-email">{user.email}</td>
                    <td>
                      <span className={`mu-role-badge ${user.role === 'admin' ? 'is-admin' : ''}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="mu-actions">
                        <button
                          type="button"
                          className="mu-btn-icon"
                          onClick={() => handleToggleRole(user)}
                          disabled={isSelf}
                          title={isSelf ? "You can't change your own role" : `Make ${user.role === 'admin' ? 'user' : 'admin'}`}
                        >
                          {user.role === 'admin' ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                          {user.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button
                          type="button"
                          className="mu-btn-icon mu-btn-danger"
                          onClick={() => handleDelete(user)}
                          disabled={isSelf}
                          title={isSelf ? "You can't delete your own account" : 'Delete user'}
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}