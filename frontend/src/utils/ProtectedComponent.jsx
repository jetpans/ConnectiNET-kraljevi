import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const checkToken = (token) => {
  const decodedToken = jwtDecode(token);

  const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

  if (decodedToken.exp < currentTime) {
    return false;
  }

  return true;
}

export const ProtectedComponent = (props) => {
  const navigate = useNavigate();
  const { user, updateUser, logout, loading } = useUser();
  const roles = props.roles;

  useEffect(() => {
    if(user && user !== null && roles && roles !== null && roles.length !== 0) {
      const token = localStorage.getItem("jwt");

      if(token === null) {
        navigate("/login");
      } else {
        const tokenValid = checkToken(token);
        if(tokenValid === false) {
          localStorage.removeItem("jwt");
          navigate("/login");
        }
        if(roles !== undefined && roles !== null && roles.length !== 0 && roles.includes(user.roleId)) {
        } else {
          navigate("/events");
        }
      }
    }
  }, [user]);

  return (
    <>
      {props.children}
    </>
  );
}