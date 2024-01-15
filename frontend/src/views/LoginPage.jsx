import * as React from "react";
import Avatar from "@mui/material/Avatar";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import dataController from "../utils/DataController";

import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

import { useState, useEffect } from "react";
import { checkToken } from "../utils/ProtectedComponent";
import { useSnackbar } from "../context/SnackbarContext";

export default function LoginPage(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const [error, setError] = useState([false, false]);

  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const { user, updateUser, logout, loading } = useUser();

  const dc = new dataController();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (data.get("username") === "") {
      setError([true, error[1]]);
    }
    if (data.get("password") === "") {
      setError([error[0], true]);
    }
    if (data.get("username") === "" || data.get("password") === "") {
      return;
    }

    const loginData = {
      username: data.get("username"),
      password: data.get("password"),
    };

    dc.PostData(API_URL + "/login", loginData)
      .then((resp) => {
        if (resp.success === true && resp.data.success === true) {
          // console.log("Success!");
          // console.log("User is", resp.data);
          localStorage.setItem("jwt", resp.data.data.access_token);
          // console.log("Set acess token to", resp.data.data.access_token);

          updateUser({
            id: resp.data.data.user.id,
            username: resp.data.data.user.username,
            roleId: resp.data.data.user.roleId,
            countryCode: resp.data.data.user.countryCode,
            email: resp.data.data.user.email,
          });
        } else {
          // console.log('Error!');
          // console.log(resp.data);
          openSnackbar('error', 'Login unsuccessful. Please check your credentials.');
          setError([false, false]);
        }
      }).catch((resp) => {
        // console.log(resp.data);
        openSnackbar('error', 'Login unsuccessful. Please check your credentials.');
        setError([false, false]);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if(token !== null) {
      const tokenValid = checkToken(token);
      if(tokenValid === true) {
        navigate("/events");
      } else {
        localStorage.removeItem("jwt");
        logout();
      }
    }
  }, []);

  useEffect(() => {
    if(user !== null) {
      const accessToken = localStorage.getItem("jwt");
      if(accessToken === null) {
        logout();
      } else {
        dc.GetData(API_URL + "/api/getInformation", accessToken)
        .then((response) => {
          updateUser({
            id: user.id,
            username: user.username,
            roleId: user.roleId,
            countryCode: user.countryCode,
            email: user.email,
            profileImage: response.data.data.profileImage,
          });
        }).then((resp) => {
          navigate("/events");
        }).catch((response) => { console.log(response) });
      }
    }
  }, [user]);

  return (
    <>
      {false ? (
        <Navigate to="/events" />
      ) : (
        <div>
          <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={5}
              md={7}
              sx={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1621112904887-419379ce6824?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                backgroundRepeat: "no-repeat",
                backgroundColor: (t) =>
                  t.palette.mode === "light"
                    ? t.palette.grey[50]
                    : t.palette.grey[900],
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Grid
              item
              xs={12}
              sm={7}
              md={5}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 10,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
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
                        helperText={
                          error[0] ? "Username cannot be empty" : null
                        }
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
                        helperText={
                          error[1] ? "Password cannot be empty" : null
                        }
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
      )}
    </>
  );
}
