import React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext";
import CssBaseline from "@mui/material/CssBaseline";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import { Card, CardContent, Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
import { Radio, RadioGroup, FormControlLabel, InputAdornment } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import dataController from "../utils/DataController";
import ImageUploadButton from "../ui/ImageUploadButton";

function ImageUploadDialog({ imageDialogOpened, setImageDialogOpened }) {

    function handleCloseDialog() {
        setImageDialogOpened(false);
    }

    return (
        <Dialog open={imageDialogOpened} 
                onClose={() => setImageDialogOpened(false)}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        handleCloseDialog();
                    }
                }}
        >
            <DialogTitle>Upload Event Picture</DialogTitle>
            <DialogContent>
                <DialogContentText>This image will be displayed on the event card.</DialogContentText>
                <ImageUploadButton />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function CreateEventsPage() {
    const [paid, setPaid] = useState(false); // paid option selected in radio button
    const [countries, setCountries] = useState(null);
    const [categories, setCategories] = useState(null);
    const [price, setPrice] = useState(0);
    const [priceErrorState, setPriceErrorState] = useState(false); 
    const [priceHelperText, setPriceHelperText] = useState(""); // TODO: implement helper text for price field
    const [imageDialogOpened, setImageDialogOpened] = useState(true);

    const { openSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("jwt");
    const API_URL = process.env.REACT_APP_API_URL;
    const dc = new dataController();
    const fetchCountries = async () => {
      await dc
        .GetData(API_URL + "/api/countries")
        .then((resp) => setCountries(resp.data.data))
        .catch((resp) => {
          console.log(resp);
        });
    };
    const fetchCategories = async () => {
        await dc
          .GetData(API_URL + "/api/getEventTypes", accessToken)
          .then((resp) => setCategories(resp.data.data))
          .catch((resp) => {
            console.log(resp);
          });
    }

    useEffect(() => {
        fetchCountries();
        fetchCategories();
    }, []);

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
        const newEventData = {
            title: data.get("eventName"),
            description: data.get("description"),
            city: data.get("city"),
            location: data.get("location"),
            countryCode: data.get("country"),
            eventType: data.get("eventType"),
            dateTime: data.get("fromDate"),
            duration: data.get("toDate"), // TODO: figure out duration
            //durationUnit: data.get("durationUnit"),
            price: data.get("price") || 0 // set price to 0 if it is null
        };
        console.log(newEventData);

        dc.PostData(API_URL + "/api/createEvent", newEventData, accessToken)
            .then((resp) => {
                if (resp.success === true && resp.data.success === true) {
                    openSnackbar("success", "Event created successfully!");
                    // TODO: open upload image dialog
                    setImageDialogOpened(true);
                } else {
                    openSnackbar("error", "Error creating event: " + resp.data.data);
                }
            })
            .catch((resp) => {
                console.log(resp);
                openSnackbar("error", "Error creating event");
            });
    }

    return (
        <div>
            <ProtectedComponent>
                <CssBaseline />
                <MainHeader for="Create a new Event!"/>
                <Container maxWidth="sm">
                    {/* <Typography variant="h4" align="center" gutterBottom marginTop={3}>
                        Create Event
                    </Typography> */}
                    <Card elevation={4}>
                        <CardContent>
                            <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{
                                            pattern: ".{1,200}",
                                            title: "Must be under 200 characters long",
                                        }}
                                        required
                                        fullWidth
                                        label="Event Name"
                                        name="eventName"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{
                                            maxLength: 2000,
                                            title: "Must be under 2000 characters long",
                                        }}
                                        required
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{
                                            pattern: "[A-Za-z ]{1,50}",
                                            title: "Letters only (max 50 characters)",
                                        }}
                                        required
                                        fullWidth
                                        label="City"
                                        name="city"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{
                                            pattern: ".{1,100}",
                                            title: "Must be under 100 characters long",
                                        }}
                                        required
                                        fullWidth
                                        label="Address"
                                        name="location"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth >
                                        <InputLabel id="country-select-label">Country</InputLabel>
                                        {/* TODO: fix changing from uncontrolled input to controlled input */}
                                        <Select
                                            labelId="country-select-label"
                                            label="Country"
                                            name="country"
                                            required
                                        >
                                            <MenuItem value="none" disabled>Select a Country</MenuItem>
                                            {countries && countries.map((country) => (
                                                <MenuItem key={country.countryCode} value={country.countryCode}>{country.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                               </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="event-type-select-label">Event Type</InputLabel>
                                        <Select
                                            labelId="event-type-select-label"
                                            label="Event Type"
                                            name="eventType"
                                            required
                                        >
                                            <MenuItem value="none" disabled>Select a Type</MenuItem>
                                            {categories && categories.map((category) => (
                                                <MenuItem 
                                                    key={category.typeId} 
                                                    value={category.typeId}
                                                >{category.typeName}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{
                                            min: "2024-01-01T00:00", // min date is 2024
                                            max: "2101-12-31T23:59", // max date is 2101
                                            title: "Must be a valid date"
                                        }}
                                        required
                                        fullWidth
                                        label="From Date"
                                        name="fromDate"
                                        type="datetime-local"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{
                                            min: "2024-01-01T00:00", // min date is 2024
                                            max: "2101-12-31T23:59", // max date is 2101
                                            title: "Must be a valid date"
                                        }}
                                        required
                                        fullWidth
                                        label="To Date"
                                        name="toDate"
                                        type="datetime-local"
                                        InputLabelProps={{
                                            shrink: true,
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
                                    <InputLabel>Pricing</InputLabel>
                                    <FormControl>
                                        <FormControl component="fieldset">
                                            <RadioGroup name="priceOptions" defaultValue="free" onChange={handleRadioChange}>
                                                <FormControlLabel value="free" control={<Radio />} label="Free" />
                                                <FormControlLabel value="paid" control={<Radio />} label="Paid" /> 
                                                <TextField
                                                    fullWidth
                                                    label="Entry fee"
                                                    name="price"
                                                    helperText={priceHelperText}
                                                    value={price}
                                                    disabled={!paid}
                                                    required={paid}
                                                    error={priceErrorState}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
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
                                    <Button type="submit" variant="contained" color="primary" fullWidth>
                                        Create Event
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Container>
                <ImageUploadDialog imageDialogOpened={imageDialogOpened} setImageDialogOpened={setImageDialogOpened}/>
                <MainFooter />
            </ProtectedComponent>
        </div>
    );
}