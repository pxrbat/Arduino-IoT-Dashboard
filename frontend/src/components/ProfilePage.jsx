// src/components/ProfilePage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { User as UserIcon, KeyRound } from 'lucide-react';
import Avatar from './Avatar';
import './ProfilePage.css';

const API_BASE = 'http://localhost:5000/api/auth';
const AVATAR_COLORS = ['#2563eb', '#0891b2', '#16a34a', '#ca8a04', '#dc2626', '#7c3aed'];

export default function ProfilePage({ session, onSessionUpdate }) {
  const [name, setName] = useState(session.name);
  const [email, setEmail] = useState(session.email);
  const [avatarColor, setAvatarColor] = useState(session.avatarColor || '#2563eb');
  const [profileStatus, setProfileStatus] = useState('');
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const authHeaders = {
    headers: { Authorization: `Bearer ${session.token}` },
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileStatus('');
    setProfileError('');
    try {
      const response = await axios.put(
        `${API_BASE}/profile`,
        { name, email, avatarColor },
        authHeaders
      );
      onSessionUpdate(response.data);
      setProfileStatus('Profile updated.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/password`,
        { currentPassword, newPassword },
        authHeaders
      );
      setPasswordStatus('Password changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <div className="pp-grid">
      <form className="pp-panel" onSubmit={handleSaveProfile}>
        <div className="pp-heading-row">
          <span className="pp-heading-icon-wrap">
            <UserIcon size={14} strokeWidth={2} />
          </span>
          <div>
            <h3 className="pp-heading">My Profile</h3>
            <p className="pp-subtext">Update your name, email, and avatar color.</p>
          </div>
        </div>

        <div className="pp-avatar-row">
          <Avatar name={name} color={avatarColor} size={48} />
          <div className="pp-swatches">
            {AVATAR_COLORS.map((color) => (
              <button
                type="button"
                key={color}
                className={`pp-swatch ${avatarColor === color ? 'is-selected' : ''}`}
                style={{ background: color }}
                onClick={() => setAvatarColor(color)}
                aria-label={`Choose avatar color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="pp-field">
          <label className="pp-label" htmlFor="pp-name">Name</label>
          <input
            id="pp-name"
            type="text"
            className="pp-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="pp-field">
          <label className="pp-label" htmlFor="pp-email">Email</label>
          <input
            id="pp-email"
            type="email"
            className="pp-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {profileError && <div className="pp-message is-error">{profileError}</div>}
        {profileStatus && <div className="pp-message is-success">{profileStatus}</div>}

        <button type="submit" className="pp-btn-primary">Save Profile</button>
      </form>

      <form className="pp-panel" onSubmit={handleChangePassword}>
        <div className="pp-heading-row">
          <span className="pp-heading-icon-wrap">
            <KeyRound size={14} strokeWidth={2} />
          </span>
          <div>
            <h3 className="pp-heading">Change Password</h3>
            <p className="pp-subtext">Choose a new password of at least 6 characters.</p>
          </div>
        </div>

        <div className="pp-field">
          <label className="pp-label" htmlFor="pp-current-password">Current Password</label>
          <input
            id="pp-current-password"
            type="password"
            className="pp-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="pp-field">
          <label className="pp-label" htmlFor="pp-new-password">New Password</label>
          <input
            id="pp-new-password"
            type="password"
            className="pp-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="pp-field">
          <label className="pp-label" htmlFor="pp-confirm-password">Confirm New Password</label>
          <input
            id="pp-confirm-password"
            type="password"
            className="pp-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        {passwordError && <div className="pp-message is-error">{passwordError}</div>}
        {passwordStatus && <div className="pp-message is-success">{passwordStatus}</div>}

        <button type="submit" className="pp-btn-primary">Update Password</button>
      </form>
    </div>
  );
}