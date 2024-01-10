import React from "react";

import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import { Card, CardContent, Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Typography } from "@mui/material";
import { Radio, RadioGroup, FormControlLabel, InputAdornment } from "@mui/material";

export default function CreateEventsPage() {
    const [paid, setPaid] = useState(false); // paid option selected in radio button

    function handleRadioChange(event) {
        if (event.target.value === "paid") {
            setPaid(true);
            console.log("paid");
        } else {
            setPaid(false);
            console.log("free");
        }
    }

    return (
        <div>
            <ProtectedComponent>
                <CssBaseline />
                <MainHeader />
                <Container maxWidth="sm">
                    <Typography variant="h4" align="center" gutterBottom marginTop={3}>
                        Create Event
                    </Typography>
                    <Card elevation="4">
                        <CardContent>
                            <form>
                                <Grid container spacing={3}>
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
                                            label="Location (City)"
                                            name="location"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputLabel>Category</InputLabel>
                                        <FormControl fullWidth>
                                            <Select
                                                name="category"
                                                defaultValue="none"
                                            >
                                                <MenuItem value="none" disabled>Select a category</MenuItem>
                                                <MenuItem value="music">Music</MenuItem>
                                                <MenuItem value="sports">Sports</MenuItem>
                                                <MenuItem value="food">Food</MenuItem>
                                                <MenuItem value="technology">Technology</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
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
                                    <Grid item xs={12}>
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
                                    </Grid>
                                        <Grid item xs={12}>
                                            <InputLabel>Pricing</InputLabel>
                                            <FormControl>
                                                <FormControl component="fieldset">
                                                    <RadioGroup name="price" defaultValue="free" onChange={handleRadioChange}>
                                                        <FormControlLabel value="free" control={<Radio />} label="Free" />
                                                        <FormControlLabel value="paid" control={<Radio />} label="Paid" /> 
                                                        <TextField
                                                            fullWidth
                                                            label="Entry fee"
                                                            name="priceField"
                                                            defaultValue={0}
                                                            disabled={!paid}
                                                            required={paid}
                                                            InputProps={{
                                                                endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                                            }}
                                                            type="number"
                                                        />
                                                    </RadioGroup>
                                                </FormControl>
                                            </FormControl>
                                        </Grid>
                                    {/* {<Grid item xs={12}>
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