import React, { createContext, useContext, useState, useEffect } from 'react';
import dataController from '../utils/DataController';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [loading, setLoading] = useState(true);
  // TODO: Implement loading
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Check for user in local storage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    const dc = new dataController();
    dc.PostData(API_URL + "/logout", null).then((resp) => {
      if(resp.success === true) {
        // console.log("Logout successful");
      }
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
