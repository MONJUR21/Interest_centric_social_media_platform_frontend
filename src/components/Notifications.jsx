import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Notifications</h2>
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${notification.is_read ? 'seen' : 'unseen'}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="notification-icon">
              {notification.type === 'comment' && '💬'}
              {notification.type === 'reaction' && '👍'}
              {notification.type === 'follow' && '👤'}
            </div>
            <div className="notification-content">
              <p className="notification-message">{notification.content}</p>
              <p className="notification-time">{new Date(notification.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
