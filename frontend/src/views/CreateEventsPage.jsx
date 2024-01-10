import React from "react";

import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import { Card, CardContent, Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Typography } from "@mui/material";
import { Radio, RadioGroup, FormControlLabel, InputAdornment } from "@mui/material";
import dataController from "../utils/DataController";

export default function CreateEventsPage() {
    const [paid, setPaid] = useState(false); // paid option selected in radio button
    const [countries, setCountries] = useState(null);
    const [categories, setCategories] = useState(null);

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

    // TODO: wrap in useEffect thingy?
    if (!countries) {
        fetchCountries();
    }
    if (!categories) {
        fetchCategories();
    }

    function handleRadioChange(event) {
        if (event.target.value === "paid") {
            setPaid(true);
            //console.log("paid");
        } else {
            setPaid(false);
            //console.log("free");
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
            countryCode: data.get("country"), // check if this is correct
            category: data.get("eventType"),
            dateTime: data.get("fromDate"),
            duration: data.get("duration"), // TODO: figure out duration
            durationUnit: data.get("durationUnit"),
            price: data.get("price")
        };
        // TODO: add missing fields

        // TODO: (sanitize?) and send data to backend
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
                            <form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Event Name"
                                            name="eventName"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
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
                                            required
                                            fullWidth
                                            label="City"
                                            name="city"

                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Address"
                                            name="location"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth >
                                            <InputLabel id="country-select-label">Country</InputLabel>
                                            <Select
                                                labelId="country-select-label"
                                                label="Country"
                                                name="country"
                                                defaultValue="none"
                                                required
                                            >
                                                <MenuItem value="none" disabled>Select a country</MenuItem>
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
                                                defaultValue="none"
                                                required
                                            >
                                                <MenuItem value="none" disabled>Select a Type</MenuItem>
                                                {/* <MenuItem value="music">Music</MenuItem>
                                                <MenuItem value="sports">Sports</MenuItem>
                                                <MenuItem value="food">Food</MenuItem>
                                                <MenuItem value="technology">Technology</MenuItem>
                                                <MenuItem value="business">Culture</MenuItem>
                                                <MenuItem value="other">Education</MenuItem>
                                                <MenuItem value="other">Other</MenuItem> */}
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
                                    {/* <Grid item xs={12}> //  figure out if we need to add this
                                        <TextField
                                            required
                                            fullWidth
                                            label="To Date"
                                            name="toDate"
                                            type="datetime-local"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid> */}
                                    <Grid item xs={6}>
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
                                    </Grid>
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
                                                        defaultValue={0}
                                                        disabled={!paid}
                                                        required={paid}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                                        }}
                                                            type="number"
                                                            margin="normal"
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
                                        <Button variant="contained" color="primary" fullWidth>
                                            Create Event
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Container>
                <MainFooter />
            </ProtectedComponent>
        </div>
    );
}