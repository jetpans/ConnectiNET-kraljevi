import React, { useEffect, useState } from "react";
import {
  Paper,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Hidden,
} from "@mui/material";
import Typography from "@mui/material/Typography";

import { green, grey, indigo } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import dataController from "../utils/DataController";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import ImageUploadButton from "../ui/ImageUploadButton";
import UserUploadedImage from "../ui/UserUploadedImage";

export default function AccountPage() {
  const [editMode, setEditMode] = useState(false);
  const [countries, setCountries] = useState(null);
  const [countryCode, setCountryCode] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;
  const dc = new dataController();
  const navigate = useNavigate();

  const fetchCountries = async () => {
    await dc
      .GetData(API_URL + "/api/countries")
      .then((resp) => setCountries(resp.data.data));
  };

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const lightTheme = createTheme({
    palette: {
      primary: {
        main: indigo[400],
      },
      secondary: {
        main: grey[500],
        other: grey[200],
      },
    },
    background: {
      default: grey[100],
    },
  });
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: indigo[300],
      },
      secondary: {
        main: grey[500],
        other: grey[200],
      },
      text: {
        main: grey[900],
      },
    },
    background: {
      default: grey[900],
    },
  });

  const mainTheme = lightTheme;

  useEffect(() => {
    const accessToken = localStorage.getItem("jwt");
    if (accessToken == null) {
      navigate("/login");
    }
    fetchCountries();
  }, []);

  return (
    <Paper
      sx={{
        bgcolor: mainTheme.background.default,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <MainHeader for="Account" />

        <TableContainer
          sx={{
            bgcolor: mainTheme.background.default,
          }}
        >
          <Table aria-label="user-data-table" component={Paper}>
            <TableBody>
              <TableCell>
                <Table style={{ tableLayout: "fixed" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        sx={{
                          display: "flex",
                        }}
                      >
                        <Typography component="h1" variant="h5">
                          Account information
                        </Typography>

                        <Button
                          onClick={() => {
                            console.log(countries);

                            setEditMode(!editMode);
                          }}
                        >
                          <EditIcon style={{ margin: "0 10px" }}></EditIcon>
                        </Button>
                      </TableCell>
                      <TableCell colSpan={1}></TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>{userData.username}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Role ID</TableCell>
                      <TableCell>
                        {userData.roleId == -1
                          ? "Administrator"
                          : userData.roleId == 1
                          ? "Organizer"
                          : "Visitor"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      {editMode ? (
                        <TextField
                          inputProps={{
                            type: "email",
                            placeholder: userData.email,
                          }}
                          required
                          id="email"
                          fullWidth
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                        />
                      ) : (
                        <TableCell>{userData.email}</TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell>Country Code</TableCell>
                      {editMode ? (
                        <TextField
                          required
                          labelId="country-label"
                          name="country"
                          id="country"
                          value={countryCode}
                          label="Country"
                          fullWidth
                          onChange={(event) =>
                            setCountryCode(event.target.value)
                          }
                          placeholder="Country"
                          select
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
                      ) : (
                        <TableCell>{userData.countryCode}</TableCell>
                      )}
                    </TableRow>

                    {userData.roleId == 1 ? (
                      <>
                        <TableRow>
                          <TableCell>Organiser Name</TableCell>
                          {editMode ? (
                            <TextField
                              inputProps={{
                                pattern: "[A-Za-z]+",
                                title: "Must contain only letters.",
                              }}
                              fullWidth
                              autoComplete="organizer-name"
                              name="organizerName"
                              required
                              id="organizerName"
                              label="Organizer Name"
                              autoFocus
                            />
                          ) : (
                            <TableCell>{userData.username}</TableCell>
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell>Hidden profile</TableCell>
                          <TableCell>{userData.countryCode}</TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <>
                        <TableRow>
                          <TableCell>First Name</TableCell>
                          {editMode ? (
                            <TextField
                              inputProps={{
                                pattern: "[A-Za-z]+",
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
                          ) : (
                            <TableCell>{userData.username}</TableCell>
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell>LastName</TableCell>
                          {editMode ? (
                            <TextField
                              inputProps={{
                                pattern: "[A-Za-z]+",
                                title: "Must contain only letters.",
                              }}
                              required
                              fullWidth
                              id="lastName"
                              label="Last Name"
                              name="lastName"
                              autoComplete="family-name"
                            />
                          ) : (
                            <TableCell>{userData.countryCode}</TableCell>
                          )}
                        </TableRow>

                        <TableRow>
                          <TableCell>Password</TableCell>
                          {editMode ? (
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
                              type={"password"}
                              id="password"
                              autoComplete="new-password"
                            />
                          ) : (
                            <TableCell>*********</TableCell>
                          )}
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableCell>
              <TableCell style={{ width: "30%" }}>
                <Typography component="h4" variant="h5">
                  Current profile image
                </Typography>
                <UserUploadedImage
                  style={{ border: "1px solid black" }}
                  src="/image-demso.png"
                ></UserUploadedImage>
                <Typography component="h4" variant="h5">
                  Upload new profile image
                </Typography>
                <ImageUploadButton></ImageUploadButton>
              </TableCell>
            </TableBody>
            <TableRow>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "green",
                  margin: "1rem",
                  opacity: editMode ? 1 : 0,
                }}
              >
                Save changes
              </Button>
            </TableRow>
          </Table>
        </TableContainer>

        <MainFooter />
      </ThemeProvider>
    </Paper>
  );
}
