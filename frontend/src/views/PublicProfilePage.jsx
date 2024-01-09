import React, { useEffect, useState } from "react";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

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
    dc.GetData(API_URL + "/getOrganizerPublicProfile/" + organizerId, accessToken).then((resp) => {
      if (resp.data.success === true) {
        setOrganizerInfo(resp.data.organizerInfo);
        setCards(resp.data.organizerEvents);
    }
  });
};

  function goToSocials() {
    let url = organizerInfo.socials
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  }

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
        <MainHeader for={organizerInfo && organizerInfo.organizerName !== null ? organizerInfo.organizerName+"'s Profile" : "Organizer's Profile" }></MainHeader>
        <>
            {/* Hero unit */}
        <Container style={{ width: "fit-content" }}>
          {organizerInfo && organizerInfo !== null ? (
                <>
          <Card
            sx={{ height: '100%', margin:4, p:2}}
            elevation={24}
          >
            <Grid container spacing={4}>
                
                <Grid item xs={0} sm={1} md={1}></Grid>
              <Grid item xs={12} sm={3} md={3}>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                  <UserUploadedImage
                      src={"/" + organizerInfo.profileImage}
                      style={{ maxWidth: "150px", maxHeight: "200px", minWidth: "150px" }}
                      className="profile-image"
                  />
                </Box>
              </Grid>
              <Grid item xs={0} sm={1} md={1}></Grid>
              <Grid item xs={12} sm={7} md={7}>    
                
                  <Typography variant="h4" gutterBottom>
                    {organizerInfo.organizerName}
                  </Typography>
                  <Divider />
                  <Typography>
                    {organizerInfo.username}<br></br>({organizerInfo.country})
                  </Typography>
                  {organizerInfo.socials ? ( <>
                    <CardActions>
                      <Button variant="outlined" size="small" onClick={goToSocials}>{organizerInfo.organizerName}'s Socials</Button>
                    </CardActions>
                    </> ) : null}
              </Grid>
              </Grid>  
              </Card>
                </>
                ) : null}
                
            </Container>

        <div>
          <br></br>
        </div>
                
                                
                <Divider sx={{ mb: 0 }} />
                <div>
                    <br></br>
                </div>
              <Container sx={{ py: 4 }} maxWidth="lg">
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
