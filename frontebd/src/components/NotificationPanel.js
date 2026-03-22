import React, { useEffect, useState } from 'react';
import API from '../services/api';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="panel">
      <h3>Notifications</h3>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n) => (
          <div key={n._id} className="notification-item">
            <p>{n.message}</p>
            <small>{new Date(n.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPanel;