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
import Container from '@mui/material/Container';
import dataController from '../utils/DataController';

import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';

import { useState, useContext, useEffect } from 'react';

export default function LoginPage() {
  const [formState, setFormState] = useState('Visitor');
  const navigate = useNavigate();

  const { user, updateUser } = useUser();

  const handleSubmit = (event) => {
    event.preventDefault();

    const dc = new dataController();

    const data = new FormData(event.currentTarget);

    const loginData = {
      username: data.get('username'),
      password: data.get('password')
    }

    dc.PostData('http://127.0.0.1:5000/login', loginData)
    .then((resp) => {
      if(resp.success === true && resp.data.success === true) {
        // console.log('Success!');
        updateUser(resp.data);
      } else {
        // console.log('Error!');
        // console.log(resp.data);
      }
    }).catch((resp) => {
      
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
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
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
        </Container>
      </div>
      }
    </>
  );
}
