import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import dataController from '../utils/DataController';

import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';

import { useState, useContext, useEffect } from 'react';

export default function LoginPage() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [error, setError] = useState([false, false]);
  const navigate = useNavigate();

  const { user, updateUser } = useUser();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if(data.get('username') === '') {
      setError([true, error[1]]);      
    }
    if(data.get('password') === '') {
      setError([error[0], true]);
    }
    if(data.get('username') === '' || data.get('password') === '') {
      return;
    }

    const dc = new dataController();

    const loginData = {
      username: data.get('username'),
      password: data.get('password')
    }

    dc.PostData(API_URL + '/login', loginData)
    .then((resp) => {
      if(resp.success === true && resp.data.success === true) {
        // console.log('Success!');
        updateUser({
          "username": resp.data.username, 
          "roleId": resp.data.roleId,
          "countryCode": resp.data.countryCode, 
          "email": resp.data.email
        });
      } else {
        // console.log('Error!');
        // console.log(resp.data);
        alert('Login unsuccessful. Please check your credentials.');
        setError([false, false]);
      }
    }).catch((resp) => {
      alert('Login unsuccessful. Please check your credentials.');
      setError([false, false]);
    });
  }

  useEffect(() => {
    if(user !== null) {
      navigate("/events");
    }
  }, []);
  useEffect(() => {
    if(user !== null) {
      navigate("/events");
    }
  }, [user]);

  return (
    <>
      {user ? <Navigate to="/events" /> : 
      <div>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={5}
            md={7}
            sx={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1621112904887-419379ce6824?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={7} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 10,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="username"
                      label="Username"
                      type="username"
                      id="username"
                      autoComplete="username"
                      error={error[0]}
                      helperText={error[0] ? "Username cannot be empty" : null}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      error={error[1]}
                      helperText={error[1] ? "Password cannot be empty" : null}
                    />
                  </Grid>
                  </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign in
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/register" variant="body2">
                      Don't have an account? Register
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
      }
    </>
  );
}
