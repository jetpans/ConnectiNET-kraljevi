import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        // Check for notifications in local storage on component mount
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
            setNotifications(JSON.parse(storedNotifications));
        }
    }, []);

    const addNotifications = (newNotifications) => {
      setNotifications([]);
      for(const notification of newNotifications) {
        setNotifications(prevNotifications => [...prevNotifications, notification]);
      } 
    };

    const clearNotifications = () => {
        setNotifications([]);
        localStorage.removeItem('notifications');
    };

    const saveNotificationState = () => {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    const setNewNotification = () => {
      setAlert(true);
    }
    const setSeenNotifications = () => {
      setAlert(false);
    }

    return (
        <NotificationContext.Provider value={{ saveNotificationState, notifications, addNotifications, clearNotifications, setNewNotification, setSeenNotifications, alert }}>
            {children}
        </NotificationContext.Provider>
    );
};
