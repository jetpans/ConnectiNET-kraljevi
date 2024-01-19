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
import Checkbox from "@mui/material/Checkbox";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Paper, InputLabel, MenuItem } from "@mui/material";
import dataController from "../utils/DataController";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState, useContext, useEffect } from "react";
import { checkToken } from "../utils/ProtectedComponent";
import { useSnackbar } from "../context/SnackbarContext";

export default function RegisterPage() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [formState, setFormState] = useState("Visitor");
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [countries, setCountries] = useState(null);
  const { user, updateUser, logout, loading } = useUser();
  const { openSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const dc = new dataController();

  const fetchCountries = async () => {
    await dc
      .GetData(API_URL + "/api/countries")
      .then((resp) => setCountries(resp.data.data));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const loginData = {
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
      countryCode: data.get("country"),
      roleId: data.get("role") === "Organizer" ? 1 : 0,
    };

    if (
      data.get("role") === "Visitor" &&
      data.get("firstName") !== "" &&
      data.get("lastName") !== ""
    ) {
      loginData.firstName = data.get("firstName");
      loginData.lastName = data.get("lastName");
    } else if (
      data.get("role") === "Organizer" &&
      data.get("organizerName") !== ""
    ) {
      loginData.organizerName = data.get("organizerName");
    }

    dc.PostData(API_URL + "/register", loginData)
      .then((resp) => {
        if (resp.success === true && resp.data.success === true) {
          // console.log('Success!');
          // todo: add "token": resp.data.token
          // updateUser({
          // "username": loginData.username,
          // "roleId": loginData.roleId,
          // "countryCode": loginData.countryCode,
          // "email": loginData.email
          // });
          openSnackbar("success", "Registration successful! Please log in.");
          setTimeout(() => {
            navigate("/login");
          }, 300);
        } else {
          // console.log('Error!');
          // console.log(resp.data);
          if (resp.data.data === "Username already in use.") {
            openSnackbar(
              "warning",
              "Registration unsuccessful. Username already exists."
            );
            return;
          }
          openSnackbar(
            "warning",
            "Registration unsuccessful. " + resp.data.data
          );
        }
      })
      .catch((resp) => {
        openSnackbar("warning", "Registration unsuccessful. " + resp.data.data);
      });
  };

  useEffect(() => {
    if (user !== null) {
      const accessToken = localStorage.getItem("jwt");
      if (accessToken === null) {
        logout();
      } else {
        dc.GetData(API_URL + "/api/getInformation", accessToken)
          .then((response) => {
            updateUser({
              username: user.username,
              roleId: user.roleId,
              countryCode: user.countryCode,
              email: user.email,
              profileImage: response.data.data.profileImage,
            });
          })
          .then((resp) => {
            navigate("/events");
          })
          .catch((response) => {
            console.log(response);
          });
      }
    }
    fetchCountries();
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
              sm={3}
              md={6}
              sx={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1698281941670-27b48d066475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY5OTg4MzkxOA&ixlib=rb-4.0.3&q=80&w=1080)",
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
              sm={9}
              md={6}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 8,
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
                  Sign up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        marginTop: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      required
                    >
                      <Typography component="h1" variant="h5">
                        Account Type:
                      </Typography>
                      <RadioGroup
                        aria-labelledby="row-radio-buttons-role"
                        name="role"
                        onChange={(event) => setFormState(event.target.value)}
                        defaultValue={"Visitor"}
                      >
                        <FormControlLabel
                          value="Visitor"
                          control={<Radio />}
                          label="Visitor"
                        />
                        <FormControlLabel
                          value="Organizer"
                          control={<Radio />}
                          label="Organizer"
                        />
                      </RadioGroup>
                    </Grid>
                    {formState === "Visitor" ? (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            inputProps={{
                              pattern: "^[A-Za-zČčĆćŠšĐđŽž ]{1,50}$",
                              title: "Must contain only letters.",
                            }}
                            autoComplete="first-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            autoFocus
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            inputProps={{
                              pattern: "^[A-Za-zČčĆćŠšĐđŽž ]{1,50}$",
                              title: "Must contain only letters.",
                            }}
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                          />
                        </Grid>
                      </>
                    ) : null}
                    {formState === "Organizer" ? (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            inputProps={{
                              pattern: "^[A-Za-zČčĆćŠšĐđŽž ]{1,50}$",
                              title: "Must contain only letters.",
                            }}
                            autoComplete="organizer-name"
                            name="organizerName"
                            required
                            fullWidth
                            id="organizerName"
                            label="Organizer Name"
                            autoFocus
                          />
                        </Grid>
                      </>
                    ) : null}
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          pattern: "^[a-zA-Z0-9]{6,20}$",
                          title: "Must be between 6 and 20 characters long",
                        }}
                        required
                        fullWidth
                        name="username"
                        label="Username"
                        type="username"
                        id="username"
                        autoComplete="username"
                        helperText="Must be between 6 and 20 characters long"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          type: "email",
                        }}
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          pattern: "[a-zA-Z0-9]*[a-z]+[0-9]+[a-zA-Z0-9]*",
                          title:
                            "Must contain at least one lowercase letter, digit and be at least 8 characters long.",
                        }}
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword === true ? "" : "password"}
                        id="password"
                        autoComplete="new-password"
                        helperText="Must contain at least one lowercase letter, digit and be at least 8 characters long"
                      />
                      {/* TODO: Show password button
                      <FormControlLabel
                        control={<Checkbox value="show-password" color="primary" />}
                        label="Show Password"
                        onClick={() => setShowPassword(!showPassword)}
                      /> */}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        position: "center",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      fullWidth
                    >
                      <TextField
                        required
                        labelId="country-label"
                        name="country"
                        id="country"
                        value={countryCode}
                        label="Country"
                        onChange={(event) => setCountryCode(event.target.value)}
                        style={{ width: "50%" }}
                        placeholder="Country"
                        select
                        fullWidth
                      >
                        {countries != null ? (
                          countries.map((country) => (
                            <MenuItem
                              key={country.countryCode}
                              value={country.countryCode}
                            >
                              {country.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value={""}>Loading...</MenuItem>
                        )}
                      </TextField>
                      {/* <TextField
                        required
                        fullWidth
                        name="country"
                        label="Country code"
                        type="country"
                        id="country"
                        autoComplete="country"
                        helperText="3-letter country code, ex: HRV, AUT..."
                      /> */}
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign Up
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link href="/login" variant="body2">
                        Already have an account? Sign in
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
