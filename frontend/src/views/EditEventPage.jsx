import React from "react";

import { useState, useEffect } from "react";
import { useSnackbar } from "../context/SnackbarContext";
import { useDialog } from "../context/DialogContext";
import CssBaseline from "@mui/material/CssBaseline";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import UserUploadedImage from "../ui/UserUploadedImage";
import {
  Card,
  CardContent,
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import dataController from "../utils/DataController";
import ImageUploadButton from "../ui/ImageUploadButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUser } from "../context/UserContext";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function EditEventPage() {
  const { eventId } = useParams();
  const [paid, setPaid] = useState(false); // paid option selected in radio button
  const [countries, setCountries] = useState(null);
  const [categories, setCategories] = useState(null);
  const [priceErrorState, setPriceErrorState] = useState(false);
  const [priceHelperText, setPriceHelperText] = useState(""); // TODO: implement helper text for price field
  const [imageDialogOpened, setImageDialogOpened] = useState(false);
  const [eventMedia, setEventMedia] = useState([]);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [oldEventData, setOldEventData] = useState(null);
  const [price, setPrice] = useState(
    oldEventData && oldEventData !== null ? oldEventData.price : 0
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const { openSnackbar } = useSnackbar();
  const accessToken = localStorage.getItem("jwt");
  const API_URL = process.env.REACT_APP_API_URL;
  const dc = new dataController();

  const { dialogComponent, isDialogOpen, openDialog, closeDialog } =
    useDialog();

  const { user } = useUser();

  useEffect(() => {
    if (
      oldEventData &&
      oldEventData !== null &&
      oldEventData.price &&
      oldEventData.price !== null &&
      oldEventData.price !== 0
    ) {
      setPrice(oldEventData.price);
      setPaid(true);
    }
  }, [oldEventData]);

  const handleOpenImageUploadDialog = (eventId) => {
    const EventImageUploadDialog = (
      <Paper sx={{ bgcolor: "white" }}>
        <DialogTitle>Upload Event Picture</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This image will be displayed on the event card.
          </DialogContentText>
          <ImageUploadButton route={"/api/uploadEventImage/" + eventId} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsMediaOpen(true);
              closeDialog();
            }}
          >
            Next
          </Button>
          <Button onClick={closeDialog}>Cancel</Button>
        </DialogActions>
      </Paper>
    );
  };

  const refreshMyEventMedia = async (eventId) => {
    dc.GetData(API_URL + "/api/getEventMedia/" + eventId, accessToken)
      .then((resp) => {
        if (resp.data && resp.data.success === true) {
          setEventMedia(resp.data.data);
        } else {
          openSnackbar("error", "Failed to fetch media.");
        }
      })
      .catch((e) => openSnackbar("error", "Failed to fetch media."));
  };

  const deleteEventMedia = (event) => {
    let mediaId = event.currentTarget.id;
    dc.PostData(API_URL + "/api/deleteEventMedia/" + mediaId, "", accessToken)
      .then((resp) => {
        if (resp.data && resp.data.success === true) {
          openSnackbar("success", "Successfuly deleted media.");
        } else {
          openSnackbar("error", "Failed to delete media.");
        }
      })
      .catch((e) => openSnackbar("error", "Failed to delete media."));
  };
  const fetchCountries = async () => {
    dc.GetData(API_URL + "/api/countries")
      .then((resp) => setCountries(resp.data.data))
      .catch((resp) => {
        console.log(resp);
      });
  };
  const fetchCategories = async () => {
    dc.GetData(API_URL + "/api/getEventTypes", accessToken)
      .then((resp) => setCategories(resp.data.data))
      .catch((resp) => {
        console.log(resp);
      });
  };

  const fetchUserData = async () => {
    dc.GetData(API_URL + "/api/getInformation", accessToken)
      .then((resp) => {
        setUserData(resp.data.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const fetchEventData = async () => {
    dc.GetData(API_URL + "/getEvent/" + eventId, accessToken)
      .then((resp) => {
        if (resp.data.success === true) {
          setOldEventData(resp.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchEventData();
    fetchUserData();
    fetchCountries();
    fetchCategories();
    refreshMyEventMedia(eventId);
  }, [user]);
  //console.log(oldEventData);

  useEffect(() => {
    if (
      user &&
      user !== null &&
      user.roleId &&
      user.roleId !== null &&
      user.roleId === 1
    ) {
      dc.GetData(
        API_URL + "/api/getSubscriberInfo",
        localStorage.getItem("jwt")
      ).then((resp) => {
        setIsSubscribed(resp.data.data.isSubscribed);
      });
    }
  }, [user]);

  function handleRadioChange(event) {
    if (event.target.value === "paid") {
      setPaid(true);
      setPriceErrorState(true);
      setPriceHelperText("Entry fee cannot be 0");
    } else {
      setPaid(false);
      setPrice(0);
      setPriceErrorState(false);
      setPriceHelperText("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const updatedEventData = {
      title: data.get("eventName"),
      description: data.get("description"),
      city: data.get("city"),
      location: data.get("location"),
      countryCode: data.get("country"),
      eventType: data.get("eventType"),
      dateTime: data.get("fromDate"),
      duration: data.get("toDate"),
      price: data.get("price") || 0,
    };

    dc.PutData(
      API_URL + "/api/editEvent/" + eventId,
      eventId,
      updatedEventData,
      accessToken
    )
      .then((resp) => {
        if (resp.success === true) {
          openSnackbar("success", "Event updated successfully!");
          handleOpenImageUploadDialog(resp.data.data.eventId);
        } else {
          openSnackbar("error", "Error updating event. Error: " + resp.message);
        }
      })
      .catch((resp) => {
        openSnackbar("error", "Error updating event");
      });
  }

  const { theme } = useTheme();

  return (
    <ProtectedComponent roles={[1, -1]}>
      <div
        style={{
          minHeight: "100vh",
        }}
      >
        <CssBaseline />
        <MainHeader for="Edit Event" />
        <Paper
          sx={{
            bgcolor: theme.palette.background.default,
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {(oldEventData && oldEventData.my_event) || userData.roleId == -1 ? (
            <Container
              sx={{
                marginTop: 6,
                marginBottom: 6,
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "2rem",
              }}
            >
              {/* <Typography variant="h4" align="center" gutterBottom marginTop={3}>
                                                    Edit Event
                                            </Typography> */}
              <Card
                elevation={4}
                sx={{
                  width: "50rem",
                  bgcolor: theme.palette.background.table,
                }}
              >
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    component="form"
                    onSubmit={handleSubmit}
                  >
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          pattern: ".{1,200}",
                          title: "Must be under 200 characters long",
                          style: { color: theme.palette.text.main },
                        }}
                        InputLabelProps={{
                          style: { color: theme.palette.text.light },
                        }}
                        required
                        fullWidth
                        label="Event Name"
                        name="eventName"
                        defaultValue={oldEventData.title}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          maxLength: 2000,
                          title: "Must be under 2000 characters long",
                          style: { color: theme.palette.text.main },
                        }}
                        InputLabelProps={{
                          style: { color: theme.palette.text.light },
                        }}
                        required
                        fullWidth
                        label="Description"
                        name="description"
                        multiline
                        rows={4}
                        defaultValue={oldEventData.description}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          pattern: "[A-Za-z ]{1,50}",
                          title: "Letters only (max 50 characters)",
                          style: { color: theme.palette.text.main },
                        }}
                        InputLabelProps={{
                          style: { color: theme.palette.text.light },
                        }}
                        required
                        fullWidth
                        label="City"
                        name="city"
                        defaultValue={oldEventData.city}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          pattern: ".{1,100}",
                          title: "Must be under 100 characters long",
                          style: { color: theme.palette.text.main },
                        }}
                        InputLabelProps={{
                          style: { color: theme.palette.text.light },
                        }}
                        required
                        fullWidth
                        label="Address"
                        name="location"
                        defaultValue={oldEventData.location}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel
                          id="country-select-label"
                          sx={{ color: theme.palette.text.light }}
                        >
                          Country
                        </InputLabel>
                        {/* TODO: fix changing from uncontrolled input to controlled input */}
                        <Select
                          labelId="country-select-label"
                          label="Country"
                          name="country"
                          required
                          defaultValue={oldEventData.countryCode}
                          sx={{ color: theme.palette.text.light }}
                        >
                          <MenuItem value="none" disabled>
                            Select a Country
                          </MenuItem>
                          {countries &&
                            countries.map((country) => (
                              <MenuItem
                                key={country.countryCode}
                                value={country.countryCode}
                              >
                                {country.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel
                          id="event-type-select-label"
                          sx={{ color: theme.palette.text.light }}
                        >
                          Event Type
                        </InputLabel>
                        <Select
                          labelId="event-type-select-label"
                          label="Event Type"
                          name="eventType"
                          required
                          defaultValue={oldEventData.eventType}
                          sx={{ color: theme.palette.text.light }}
                        >
                          <MenuItem value="none" disabled>
                            Select a Type
                          </MenuItem>
                          {categories &&
                            categories.map((category) => (
                              <MenuItem
                                key={category.typeId}
                                value={category.typeId}
                              >
                                {category.typeName}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          min: "2024-01-01T00:00", // min date is 2024
                          max: "2101-12-31T23:59", // max date is 2101
                          title: "Must be a valid date",
                        }}
                        required
                        fullWidth
                        label="From Date"
                        name="fromDate"
                        type="datetime-local"
                        defaultValue={
                          oldEventData.time.slice(0, 10) +
                          "T" +
                          oldEventData.time.slice(11, 16)
                        }
                        InputLabelProps={{
                          shrink: true,
                          style: { color: theme.palette.text.light },
                        }}
                        InputProps={{
                          style: { color: theme.palette.text.main },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{
                          min: "2024-01-01T00:00", // min date is 2024
                          max: "2101-12-31T23:59", // max date is 2101
                          title: "Must be a valid date",
                        }}
                        required
                        fullWidth
                        label="To Date"
                        name="toDate"
                        type="datetime-local"
                        defaultValue={
                          oldEventData.end_time.slice(0, 10) +
                          "T" +
                          oldEventData.end_time.slice(11, 16)
                        }
                        InputLabelProps={{
                          shrink: true,
                          style: { color: theme.palette.text.light },
                        }}
                        InputProps={{
                          style: { color: theme.palette.text.main },
                        }}
                      />
                    </Grid>
                    {/* <Grid item xs={6}>
                                                                            <TextField
                                                                                    required
                                                                                    fullWidth
                                                                                    label="Duration"
                                                                                    name="duration"
                                                                                    type="number"
                                                                                    InputLabelProps={{
                                                                                            shrink: true,
                                                                                    }}
                                                                            />
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                            <FormControl fullWidth>
                                                                                    <Select
                                                                                            name="durationUnit"
                                                                                            defaultValue="minutes"
                                                                                            required
                                                                                    >
                                                                                            <MenuItem value="minutes">Minutes</MenuItem>
                                                                                            <MenuItem value="hours">Hours</MenuItem>                                                </Select>
                                                                            </FormControl>
                                                                    </Grid> */}
                    <Grid item xs={12}>
                      <InputLabel sx={{ color: theme.palette.text.light }}>
                        Pricing
                      </InputLabel>
                      <FormControl>
                        <FormControl component="fieldset">
                          <RadioGroup
                            name="priceOptions"
                            defaultValue={
                              oldEventData.price == 0 ? "free" : "paid"
                            }
                            onChange={handleRadioChange}
                            sx={{ color: theme.palette.text.light }}
                          >
                            <FormControlLabel
                              value="free"
                              control={<Radio />}
                              label="Free"
                            />
                            <FormControlLabel
                              value="paid"
                              control={<Radio />}
                              label="Paid"
                              disabled={isSubscribed ? false : true}
                            />
                            <TextField
                              fullWidth
                              defaultValue={oldEventData.price}
                              label="Entry fee"
                              name="price"
                              helperText={priceHelperText}
                              value={price}
                              disabled={!paid}
                              required={paid}
                              error={priceErrorState}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    sx={{ color: theme.palette.text.main }}
                                  >
                                    €
                                  </InputAdornment>
                                ),
                                style: { color: theme.palette.text.main },
                              }}
                              type="number"
                              margin="normal"
                              onChange={(event) => {
                                if (event.target.value < 0) {
                                  event.target.value = 0;
                                }
                                setPrice(event.target.value);
                                if (paid && event.target.value == 0) {
                                  setPriceErrorState(true);
                                  setPriceHelperText("Entry fee cannot be 0");
                                } else {
                                  setPriceErrorState(false);
                                  setPriceHelperText("");
                                }
                              }}
                              InputLabelProps={{
                                style: { color: theme.palette.text.light },
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </FormControl>
                    </Grid>
                    {/* {<Grid item xs={12}>    // image upload placeholder
                                                                            <input
                                                                                    accept="image/*"
                                                                                    id="event-image-upload"
                                                                                    multiple
                                                                                    type="file"
                                                                            />
                                                                            <label htmlFor="event-image-upload">
                                                                                    <Button variant="contained" component="span">
                                                                                            Upload Event Picture
                                                                                    </Button>
                                                                            </label>
                                                                    </Grid>} */}
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Update Event
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Paper
                sx={{
                  width: "20rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Paper sx={{ bgcolor: "white" }}>
                  <DialogTitle>Upload Event Picture</DialogTitle>

                  <DialogContent>
                    <Box
                      mt={5}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <UserUploadedImage
                        src={oldEventData.image}
                      ></UserUploadedImage>
                    </Box>
                    <DialogContentText>
                      This image will be displayed on the event card.
                    </DialogContentText>
                    <ImageUploadButton
                      route={"/api/uploadEventImage/" + eventId}
                    />
                  </DialogContent>
                </Paper>

                <Paper sx={{ bgcolor: "white" }}>
                  <DialogTitle>Upload Event Media</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      These images will be displayed on your event page
                    </DialogContentText>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxHeight: "20rem",
                        gap: "1rem",
                        alignItems: "center",
                        overflowY: "scroll",
                      }}
                    >
                      {eventMedia.map((entry) => (
                        <div>
                          <Button
                            sx={{ position: "relative" }}
                            key={entry.mediaId}
                            id={entry.mediaId}
                            onClick={(e) => deleteEventMedia(e)}
                          >
                            <DeleteIcon></DeleteIcon>
                          </Button>
                          <img
                            style={{ maxWidth: "80%" }}
                            src={entry.mediaSource}
                          />
                        </div>
                      ))}
                    </Box>
                    <ImageUploadButton
                      route={"/api/uploadEventMedia/" + eventId}
                    />

                    <DialogActions>
                      <Button onClick={() => refreshMyEventMedia(eventId)}>
                        Refresh media display
                      </Button>
                    </DialogActions>
                  </DialogContent>
                </Paper>
              </Paper>
            </Container>
          ) : (
            <>
              <Card
                sx={{
                  height: "100%",
                  margin: 4,
                  p: 2,
                  bgcolor: theme.palette.background.table,
                  color: theme.palette.text,
                }}
                elevation={4}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  color={theme.palette.text.main}
                  minWidth={"50rem"}
                >
                  Loading...
                </Typography>
              </Card>
            </>
          )}
        </Paper>
        <MainFooter />
      </div>
    </ProtectedComponent>
  );
}
