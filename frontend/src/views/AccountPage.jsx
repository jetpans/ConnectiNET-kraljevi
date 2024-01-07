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
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import dataController from "../utils/DataController";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import ImageUploadButton from "../ui/ImageUploadButton";
import UserUploadedImage from "../ui/UserUploadedImage";
import { useTheme } from "../context/ThemeContext";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import { useSnackbar } from "../context/SnackbarContext";

export default function AccountPage() {
  const [editMode, setEditMode] = useState(false);
  const [countries, setCountries] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [hidden, setHidden] = useState(false);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const { openSnackbar } = useSnackbar();

  const API_URL = process.env.REACT_APP_API_URL;
  const dc = new dataController();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("jwt");
  const fetchCountries = async () => {
    await dc
      .GetData(API_URL + "/api/countries")
      .then((resp) => setCountries(resp.data.data))
      .catch((resp) => { console.log(resp) });
  };

  const { theme, toggleTheme } = useTheme();

  const mainTheme = theme;

  const handleSubmitChange = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const loginData = {
      email: data.get("email"),
      password: data.get("password"),
      countryCode: data.get("country"),
      roleId: data.get("role") === "Organizer" ? 1 : 0,
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      organizerName: data.get("organizerName"),
      hidden: data.get("hidden"),
    };

    dc.PostData(API_URL + "/api/changeInformation", loginData, accessToken)
      .then((resp) => {
        if (resp.success === true && resp.data.success === true) {
          openSnackbar('success', 'Change successful!');
          navigate(0);
        } else {
          openSnackbar('error', 'Change unsuccessful. ' + resp.data);
        }
      })
      .catch((resp) => {
        openSnackbar('error', 'Change unsuccessful. ' + resp.data);
      });
  };

  const fetchUserData = async () => {
    const accessToken = localStorage.getItem("jwt");
    dc.GetData(API_URL + "/api/getInformation", accessToken).then((resp) => {
      console.log(resp.data.data);
      setUserData(resp.data.data);
      setCountryCode(resp.data.data.countryCode);
      setHidden(resp.data.data.hidden == "True");
    }).catch((resp) => { console.log(resp) });
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("jwt");
    if (accessToken == null) {
      navigate("/login");
    }
    fetchCountries();
    fetchUserData();
  }, []);

  return (
    <ProtectedComponent>
      <Paper
        sx={{
          bgcolor: mainTheme.palette.background.default,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CssBaseline />
        <MainHeader for="Account" />

        <TableContainer
          sx={{
            bgcolor: mainTheme.palette.background.default,
            padding: "2rem 20rem",
          }}
        >
          <Table aria-label="user-data-table" component={Paper}>
            <TableBody>
              <TableCell>
                <Table
                  style={{ tableLayout: "fixed" }}
                  component="form"
                  onSubmit={handleSubmitChange}
                  id="edit-form"
                >
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
                          }}
                          required
                          defaultValue={userData.eMail}
                          id="email"
                          fullWidth
                          name="email"
                          autoComplete="email"
                        />
                      ) : (
                        <TableCell>{userData.eMail}</TableCell>
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
                          inputProps={{ value: countryCode }}
                          fullWidth
                          value={countryCode}
                          onChange={(event) =>
                            setCountryCode(event.target.value)
                          }
                          defaultValue={countryCode}
                          placeholder={countryCode}
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
                              defaultValue={userData.organiserName}
                              fullWidth
                              autoComplete="organizer-name"
                              name="organizerName"
                              required
                              id="organizerName"
                              autoFocus
                            />
                          ) : (
                            <TableCell>{userData.organiserName}</TableCell>
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell>Hidden profile</TableCell>
                          {editMode ? (
                            <TextField
                              required
                              name="hidden"
                              id="hidden"
                              inputProps={{ value: hidden }}
                              fullWidth
                              value={hidden}
                              onChange={(event) =>
                                setHidden(event.target.value)
                              }
                              placeholder={hidden}
                              select
                            >
                              <MenuItem value={true}>True</MenuItem>
                              <MenuItem value={false}>False</MenuItem>
                            </TextField>
                          ) : (
                            <TableCell>{userData.hidden}</TableCell>
                          )}
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
                              defaultValue={userData.firstName}
                              name="firstName"
                              required
                              fullWidth
                              id="firstName"
                              autoFocus
                            />
                          ) : (
                            <TableCell>{userData.firstName}</TableCell>
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
                              defaultValue={userData.lastName}
                              required
                              fullWidth
                              id="lastName"
                              name="lastName"
                              autoComplete="family-name"
                            />
                          ) : (
                            <TableCell>{userData.lastName}</TableCell>
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
                              fullWidth
                              name="password"
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
                    <TableRow>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "green",
                          margin: "1rem",
                          opacity: editMode ? 1 : 0,
                        }}
                        type="submit"
                        form="edit-form"
                      >
                        Save changes
                      </Button>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableCell>
              <TableCell
                style={{
                  width: "200px",
                  display: "grid",
                }}
              >
                <Typography component="h4" variant="h5">
                  Current profile image
                </Typography>
                <UserUploadedImage
                  style={{
                    border: "1px solid black",
                  }}
                  src={"/" + userData.profileImage}
                ></UserUploadedImage>

                {editMode ? (
                  <>
                    <Typography component="h4" variant="h5">
                      Upload new profile image
                    </Typography>
                    <ImageUploadButton route="/api/usernameTempUpload"></ImageUploadButton>
                  </>
                ) : (
                  <></>
                )}
              </TableCell>
            </TableBody>
          </Table>
        </TableContainer>

        <MainFooter />
      </Paper>
    </ProtectedComponent>
  );
}
