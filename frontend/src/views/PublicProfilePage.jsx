import React, { useEffect, useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import UserUploadedImage from "../ui/UserUploadedImage";

import { green, grey, indigo } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Divider, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EventCard from "../ui/EventCard";
import dataController from "../utils/DataController";

import { useUser } from "../context/UserContext";

import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";

export default function OrganizerProfile() {
  const API_URL = process.env.REACT_APP_API_URL;

  const { organizerId } = useParams();
  const [organizerInfo, setOrganizerInfo] = useState(null);
  const [cards, setCards] = useState(null);
  const navigate = useNavigate();

  const dc = new dataController();

  const fetchData = async () => {
    const accessToken = localStorage.getItem('jwt');
    dc.GetData(API_URL + "/getOrganizerPublicProfile/"+organizerId, accessToken).then((resp) => {
      if (resp.data.success === true) {
        setOrganizerInfo(resp.data.organizerInfo);
        setCards(resp.data.organizerEvents);
    }
  });
};

  useEffect(() => {
    const accessToken = localStorage.getItem("jwt");
    if (accessToken === null) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, []);

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
  
  return (
    <Paper sx={{ bgcolor: mainTheme.background.default }}>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <MainHeader for="Organizer"></MainHeader>
        <>
            {/* Hero unit */}
            <Container sx={{ py: 4 }} maxWidth="lg">
                {organizerInfo && organizerInfo !== null ? (
                <>
                    <Typography variant="h4" gutterBottom>
                    {organizerInfo.organizerName}'s Profile
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                    <UserUploadedImage
                        src={organizerInfo.profileImage}
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                        className="profile-image"
                    />
                    <Typography>
                        Email: {organizerInfo.eMail}
                    </Typography>
                    <Typography>
                        Country: {organizerInfo.countryCode}
                    </Typography>
                    </Box>
                </>
                ) : null}

                <Divider sx={{ mb: 4 }} />

                <div>
                    <br></br>
                </div>

                <Grid container spacing={4}>
                    {cards && cards !== null ? (
                        cards.map((card) => (
                            <Grid item key={card.id} xs={12} sm={6} md={6}>
                                <EventCard card={card} />
                            </Grid>
                        ))
                    ) : (
                         <Box
                            sx={{
                                bgcolor: mainTheme.palette.secondary.other,
                                height: "1000px",
                            }}
                            component="footer"
                        />
                    )}
                </Grid>
            </Container>
        </>
        <MainFooter></MainFooter>
      </ThemeProvider>
    </Paper>
  );
}
