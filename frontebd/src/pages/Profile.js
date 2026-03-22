import React from 'react';
import Navbar from '../components/Navbar';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <Navbar />

      <div className="form-page">
        <div className="profile-card">
          <h2>My Profile</h2>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Roll Number:</strong> {user?.rollNumber}</p>
          <p><strong>Department:</strong> {user?.department}</p>
          <p><strong>Year:</strong> {user?.year}</p>
          <p><strong>Reputation:</strong> {user?.reputation || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;