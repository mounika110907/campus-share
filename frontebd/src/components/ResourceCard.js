import React, { useState } from 'react';
import API from '../services/api';

const ResourceCard = ({ resource, refresh }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const borrowNow = async () => {
    try {
      await API.post('/borrow', {
        resourceId: resource._id,
        startDate,
        endDate
      });

      alert('Borrow request sent successfully');
      setStartDate('');
      setEndDate('');

      if (refresh) refresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Error sending request');
    }
  };

  return (
    <div className="card">
      {resource.imageUrl && (
        <img src={resource.imageUrl} alt={resource.title} className="resource-img" />
      )}

      <h3>{resource.title}</h3>
      <p>{resource.description}</p>
      <p><strong>Category:</strong> {resource.category}</p>
      <p><strong>Condition:</strong> {resource.condition}</p>
      <p><strong>Owner:</strong> {resource.owner?.name}</p>
      <p><strong>Department:</strong> {resource.owner?.department}</p>
      <p><strong>Reputation:</strong> {resource.owner?.reputation || 0}</p>

      <p className={resource.availability ? 'available' : 'unavailable'}>
        {resource.availability ? 'Available' : 'Unavailable'}
      </p>

      {user && resource.owner?._id !== user._id && resource.availability && (
        <div className="borrow-box">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button onClick={borrowNow}>Request Borrow</button>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;