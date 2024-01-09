import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import { Card, CardContent, Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Typography } from "@mui/material";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

export default function CreateEventsPage() {
    return (
        <div>
            <ProtectedComponent>
                <CssBaseline />
                <MainHeader />
                <Container maxWidth="sm">
                    <Typography variant="h4" align="center" gutterBottom>
                        Create Event
                    </Typography>
                    <Card>
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
                                            label="Location"
                                            name="location"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="From Date"
                                            name="fromDate"
                                            type="date"
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
                                            type="date"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                        <Grid item xs={6}>
                                            <InputLabel>Pricing</InputLabel>
                                            <FormControl>
                                                <FormControl component="fieldset">
                                                    <RadioGroup name="price" defaultValue="free">
                                                        <FormControlLabel value="free" control={<Radio />} label="Free" />
                                                        <FormControlLabel value="paid" control={<Radio />} label="Paid" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Grid item>
                                                <TextField
                                                    fullWidth
                                                    label="Entry fee"
                                                    name="priceField"
                                                    disabled
                                                />
                                            </Grid>
                                        </Grid>
                                    <Grid item xs={12}>
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
                                    </Grid>
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