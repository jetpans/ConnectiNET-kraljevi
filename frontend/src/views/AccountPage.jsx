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
  Grid,
  Container,
  Box,
} from "@mui/material";
import Typography from "@mui/material/Typography";

import { green, grey, indigo } from "@mui/material/colors";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import dataController from "../utils/DataController";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageUploadButton from "../ui/ImageUploadButton";
import UserUploadedImage from "../ui/UserUploadedImage";
import { useTheme } from "../context/ThemeContext";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import { useSnackbar } from "../context/SnackbarContext";
import { useDialog } from "../context/DialogContext";
import AddCardIcon from "@mui/icons-material/AddCard";

export default function AccountPage() {
  const [editMode, setEditMode] = useState(false);
  const [countries, setCountries] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [notificationCountryCode, setNotificationCountryCode] = useState("");
  const [notificationEventType, setNotificationEventType] = useState("");
  const [hidden, setHidden] = useState(false);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const { openSnackbar } = useSnackbar();
  const { theme, toggleTheme } = useTheme();
  const { dialogComponent, isDialogOpen, openDialog, closeDialog } =
    useDialog();

  const confirmDeleteAccountDialog = (
    <Paper sx={{ bgcolor: theme.palette.background.table }}>
      <div className="dialog-content">
        <Container sx={{ py: 4 }} maxWidth="lg" width="100px">
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h6" color={theme.palette.text.main}>
              Are you sure you want to delete your account?{" "}
            </Typography>
            <br />
            <br />
            <br />
          </Grid>

          <Box
            fullWidth
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            <Button
              sx={{ bgcolor: "green" }}
              type="submit"
              form="edit-form"
              onClick={() => handleDeleteAccount()}
              variant="contained"
            >
              Yes
            </Button>
            <Button
              sx={{ bgcolor: "red" }}
              onClick={closeDialog}
              variant="contained"
            >
              Cancel
            </Button>
          </Box>
        </Container>
      </div>
    </Paper>
  );

  const confirmChangeInformation = (
    <Paper sx={{ bgcolor: theme.palette.background.table }}>
      <div className="dialog-content">
        <Container sx={{ py: 4 }} maxWidth="lg" width="100px">
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h6" color={theme.palette.text.main}>
              Are you sure you want to change your information?
            </Typography>
            <br />
            <br />
            <br />
          </Grid>
          <Box
            fullWidth
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            <Button
              sx={{ bgcolor: "green" }}
              type="submit"
              form="edit-form"
              onClick={() => handleSubmitChange()}
              variant="contained"
            >
              Yes
            </Button>
            <Button
              sx={{ bgcolor: "red" }}
              onClick={closeDialog}
              variant="contained"
            >
              Cancel
            </Button>
          </Box>
        </Container>
      </div>
    </Paper>
  );
  const handleOpenChangeInformationDialog = () => {
    openDialog(confirmChangeInformation);
  };

  const handleOpenDeleteAccountDialog = () => {
    openDialog(confirmDeleteAccountDialog);
  };

  const [notification, setNotification] = useState({
    countries: [],
    eventTypes: [],
  });

  const API_URL = process.env.REACT_APP_API_URL;
  const dc = new dataController();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("jwt");
  const fetchCountries = async () => {
    await dc
      .GetData(API_URL + "/api/countries")
      .then((resp) => setCountries(resp.data.data))
      .catch((resp) => {
        console.log(resp);
      });
  };

  const mainTheme = theme;

  const handleAddCountry = () => {
    if (notificationCountryCode == "") return;
    dc.PostData(
      API_URL + "/api/addNotificationCountry",
      { countryCode: notificationCountryCode },
      accessToken
    )
      .then((resp) => {
        if (resp.data.success === true) {
          openSnackbar("success", "Successfuly added country.");

          navigate(0);
        } else {
          openSnackbar("error", "Failed to add country.");
        }
      })
      .catch((e) => console.log(e));
    return;
  };

  const handleAddEventType = () => {
    if (notificationEventType == "") return;
    dc.PostData(
      API_URL + "/api/addNotificationEventType",
      { eventType: notificationEventType },
      accessToken
    )
      .then((resp) => {
        if (resp.data.success === true) {
          openSnackbar("success", "Successfuly added event type.");

          navigate(0);
        } else {
          openSnackbar("error", "Failed to add event type.");
        }
      })
      .catch((e) => console.log(e));
    return;
  };

  const handleDeleteEventType = (e) => {
    let eventTypeName = e.target.id;
    dc.PostData(
      API_URL + "/api/deleteNotificationEventType",
      { typeName: eventTypeName },
      accessToken
    )
      .then((resp) => {
        if (resp.data.success === true) {
          openSnackbar("success", "Successfuly removed event type.");
          navigate(0);
        } else {
          openSnackbar("error", "Failed to delete event type.");
        }
      })
      .catch((e) => console.log(e));
    return;
  };

  const handleDeleteCountry = (event) => {
    let countryName = event.target.id;
    dc.PostData(
      API_URL + "/api/deleteNotificationCountry",
      { countryName: countryName },
      accessToken
    )
      .then((resp) => {
        if (resp.data.success === true) {
          openSnackbar("success", "Successfuly removed country.");
          navigate(0);
        } else {
          openSnackbar("error", "Failed to delete country type.");
        }
      })
      .catch((e) => console.log(e));
    return;
  };

  const handleDeleteAccount = () => {
    closeDialog();

    dc.PostData(API_URL + "/api/deleteAccount", "", accessToken)
      .then((resp) => {
        if (resp.data.success === true) {
          openSnackbar("success", "Successfuly deleted.");
          localStorage.clear();
          navigate("/login");
        } else {
          openSnackbar("error", "Failed to delete account.");
        }
      })
      .catch((e) => console.log(e));
    return;
  };
  const handleSubmitChange = () => {
    closeDialog();

    const data = new FormData(document.getElementById("edit-form"));

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
          openSnackbar("success", "Change successful!");
          navigate(0);
        } else {
          openSnackbar("error", "Change unsuccessful. " + resp.data);
        }
      })
      .catch((resp) => {
        openSnackbar("error", "Change unsuccessful. " + resp.data);
      });
  };

  const fetchUserData = async () => {
    const accessToken = localStorage.getItem("jwt");
    dc.GetData(API_URL + "/api/getInformation", accessToken)
      .then((resp) => {
        setUserData(resp.data.data);
        setCountryCode(resp.data.data.countryCode);
        setHidden(resp.data.data.hidden == "True");
      })
      .catch((resp) => {
        console.log(resp);
      });

    dc.GetData(API_URL + "/api/getNotificationOptions", accessToken)
      .then((resp) => {
        setNotification(resp.data.data);
      })
      .catch((e) => console.log(e));

    dc.GetData(API_URL + "/api/getEventTypes", accessToken)
      .then((resp) => {
        setEventTypes(resp.data.data);
      })
      .catch((e) => console.log(e));
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
    <ProtectedComponent roles={[0, 1, -1]}>
      <Paper
        sx={{
          bgcolor: mainTheme.palette.background.default,
          minHeight: "100vh",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CssBaseline />
        <MainHeader for="Account" />

        <TableContainer
          sx={{
            bgcolor: mainTheme.palette.background.default,
            padding: "1rem 1rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <Box
            sx={{
              bgcolor: mainTheme.palette.background.default,
              padding: "1rem 1rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            <Table
              aria-label="user-data-table"
              component={Paper}
              sx={{
                bgcolor: mainTheme.palette.background.table,
                maxWidth: "40rem",
                flex: "1 1 auto",
              }}
            >
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
                          colSpan={1}
                          sx={{
                            display: "flex",
                          }}
                        >
                          <Typography
                            component="h1"
                            variant="h5"
                            color={theme.palette.text.main}
                          >
                            Account information
                          </Typography>

                          <Button
                            onClick={() => {
                              setEditMode(!editMode);
                            }}
                          >
                            <EditIcon style={{ margin: "0 10px" }}></EditIcon>
                          </Button>
                        </TableCell>
                        {userData.roleId == 0 ? (
                          <TableCell colSpan={1}>
                            <Button
                              sx={{ bgcolor: "red" }}
                              variant="countained"
                              onClick={handleOpenDeleteAccountDialog}
                            >
                              <Typography color="white">
                                Delete account
                              </Typography>{" "}
                            </Button>
                          </TableCell>
                        ) : (
                          <TableCell></TableCell>
                        )}
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ color: theme.palette.text.main }}>
                          Username
                        </TableCell>
                        <TableCell sx={{ color: theme.palette.text.main }}>
                          {userData.username}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: theme.palette.text.main }}>
                          Role ID
                        </TableCell>
                        <TableCell sx={{ color: theme.palette.text.main }}>
                          {userData.roleId == -1
                            ? "Administrator"
                            : userData.roleId == 1
                            ? "Organizer"
                            : "Visitor"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: theme.palette.text.main }}>
                          Email
                        </TableCell>
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
                          <TableCell sx={{ color: theme.palette.text.main }}>
                            {userData.eMail}
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: theme.palette.text.main }}>
                          Country Code
                        </TableCell>
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
                          <TableCell sx={{ color: theme.palette.text.main }}>
                            {userData.countryCode}
                          </TableCell>
                        )}
                      </TableRow>

                      {userData.roleId == 1 ? (
                        <>
                          <TableRow>
                            <TableCell sx={{ color: theme.palette.text.main }}>
                              Organizer Name
                            </TableCell>
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
                              <TableCell
                                sx={{ color: theme.palette.text.main }}
                              >
                                {userData.organiserName}
                              </TableCell>
                            )}
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ color: theme.palette.text.main }}>
                              Hidden profile
                            </TableCell>
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
                              <TableCell
                                sx={{ color: theme.palette.text.main }}
                              >
                                {userData.hidden}
                              </TableCell>
                            )}
                          </TableRow>
                        </>
                      ) : (
                        <>
                          <TableRow>
                            <TableCell sx={{ color: theme.palette.text.main }}>
                              First Name
                            </TableCell>
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
                              <TableCell
                                sx={{ color: theme.palette.text.main }}
                              >
                                {userData.firstName}
                              </TableCell>
                            )}
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ color: theme.palette.text.main }}>
                              LastName
                            </TableCell>
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
                              <TableCell
                                sx={{ color: theme.palette.text.main }}
                              >
                                {userData.lastName}
                              </TableCell>
                            )}
                          </TableRow>

                          <TableRow>
                            <TableCell sx={{ color: theme.palette.text.main }}>
                              Password
                            </TableCell>
                            {editMode ? (
                              <TextField
                                inputProps={{
                                  pattern:
                                    "[a-zA-Z0-9]*[a-z]+[0-9]+[a-zA-Z0-9]*",
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
                              <TableCell
                                sx={{ color: theme.palette.text.main }}
                              >
                                *********
                              </TableCell>
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
                          onClick={handleOpenChangeInformationDialog}
                        >
                          Save changes
                        </Button>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableBody>
            </Table>

            {userData.roleId == 0 ? (
              <Paper
                sx={{
                  flex: "1 1 auto",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  maxWidth: "40rem",
                  bgcolor: mainTheme.palette.background.table,
                }}
              >
                <Table style={{ tableLayout: "fixed" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography
                          component="h1"
                          variant="h5"
                          color={theme.palette.text.main}
                        >
                          Your notification preferences
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography
                          component="h5"
                          variant="h6"
                          color={theme.palette.text.main}
                        >
                          Country preferences
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          component="h5"
                          variant="h6"
                          color={theme.palette.text.main}
                        >
                          Event type preferences
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Table style={{ tableLayout: "fixed" }}>
                          <TableBody>
                            {notification.countries.map((country) => (
                              <TableRow>
                                <TableCell>{country}</TableCell>
                                <TableCell>
                                  <Button
                                    key={country}
                                    onClick={(e) => handleDeleteCountry(e)}
                                  >
                                    <DeleteIcon id={country}></DeleteIcon>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                      <TableCell>
                        <Table style={{ tableLayout: "fixed" }}>
                          <TableBody>
                            {notification.eventTypes.map((type) => (
                              <TableRow>
                                <TableCell>{type}</TableCell>
                                <TableCell>
                                  <Button
                                    key={type}
                                    onClick={(e) => handleDeleteEventType(e)}
                                  >
                                    <DeleteIcon id={type}></DeleteIcon>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <TextField
                          required
                          name="notif-country"
                          id="notif-country"
                          inputProps={{ value: notificationCountryCode }}
                          fullWidth
                          label="Choose new country"
                          onChange={(event) =>
                            setNotificationCountryCode(event.target.value)
                          }
                          select
                        >
                          {countries != null ? (
                            countries.map((country) =>
                              !notification.countries.includes(country.name) ? (
                                <MenuItem
                                  key={country.countryCode}
                                  value={country.countryCode}
                                >
                                  {country.name}
                                </MenuItem>
                              ) : null
                            )
                          ) : (
                            <MenuItem value={""}>Loading...</MenuItem>
                          )}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          required
                          name="notif-eventType"
                          id="notif-eventType"
                          label="Choose new event type"
                          inputProps={{ value: notificationEventType }}
                          fullWidth
                          onChange={(event) =>
                            setNotificationEventType(event.target.value)
                          }
                          select
                        >
                          {eventTypes != null ? (
                            eventTypes.map((type) =>
                              !notification.eventTypes.includes(
                                type.typeName
                              ) ? (
                                <MenuItem key={type.typeId} value={type.typeId}>
                                  {type.typeName}
                                </MenuItem>
                              ) : null
                            )
                          ) : (
                            <MenuItem value={""}>Loading...</MenuItem>
                          )}
                        </TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="contained"
                          sx={{ width: "80%" }}
                          onClick={() => handleAddCountry()}
                        >
                          Add country
                        </Button>
                      </TableCell>{" "}
                      <TableCell>
                        <Button
                          variant="contained"
                          sx={{ width: "80%" }}
                          onClick={() => handleAddEventType()}
                        >
                          Add event
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            ) : null}

            <Paper
              sx={{
                flex: "1 1 auto",
                maxWidth: "20rem",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                bgcolor: mainTheme.palette.background.table,
              }}
            >
              {" "}
              <div>
                <Typography
                  component="h4"
                  variant="h5"
                  color={theme.palette.text.main}
                >
                  Current profile image:
                </Typography>
                <Box mt={5} sx={{ display: "flex", justifyContent: "center" }}>
                  <UserUploadedImage
                    src={userData.profileImage}
                  ></UserUploadedImage>
                </Box>
              </div>
              <div>
                <Typography
                  component="h4"
                  variant="h5"
                  color={theme.palette.text.main}
                  mb={4}
                >
                  Upload new profile image:
                </Typography>
                <ImageUploadButton route="/api/usernameTempUpload"></ImageUploadButton>
              </div>
            </Paper>
          </Box>
        </TableContainer>

        <MainFooter />
      </Paper>
    </ProtectedComponent>
  );
}
