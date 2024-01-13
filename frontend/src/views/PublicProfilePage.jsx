import React, { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

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
import { ProtectedComponent } from "../utils/ProtectedComponent";
import { useTheme } from "../context/ThemeContext";

export default function OrganizerProfile() {
  const API_URL = process.env.REACT_APP_API_URL;

  const { organizerId } = useParams();
  const [organizerInfo, setOrganizerInfo] = useState(null);
  const [cards, setCards] = useState(null);
  const navigate = useNavigate();

  const dc = new dataController();

  const fetchData = async () => {
    const accessToken = localStorage.getItem("jwt");
    dc.GetData(
      API_URL + "/getOrganizerPublicProfile/" + organizerId,
      accessToken
    )
      .then((resp) => {
        if (resp.data.success === true) {
          setOrganizerInfo(resp.data.organizerInfo);
          setCards(resp.data.organizerEvents);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function goToSocials() {
    let url = organizerInfo.socials;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    window.open(url, "_blank");
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("jwt");
    if (accessToken === null) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, []);

  const { theme } = useTheme();

  return (
    <ProtectedComponent roles={[0, -1, 1]}>
      <Paper sx={{ bgcolor: theme.palette.background.default }}>
        <CssBaseline />
        <MainHeader
          for={
            organizerInfo && organizerInfo.organizerName !== null
              ? organizerInfo.organizerName + "'s Profile"
              : "Organizer's Profile"
          }
        ></MainHeader>
        <>
          {/* Hero unit */}
          <Container style={{ width: "fit-content" }}>
            {organizerInfo && organizerInfo !== null ? (
              <>
                <Card
                  sx={{
                    height: "100%",
                    margin: 4,
                    p: 2,
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text,
                  }}
                  elevation={24}
                >
                  <Grid container spacing={4}>
                    <Grid item xs={0} sm={1} md={1}></Grid>
                    <Grid item xs={12} sm={3} md={3}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <img
                          src={organizerInfo.profileImage}
                          style={{
                            maxWidth: "150px",
                            maxHeight: "200px",
                            height: "200px",
                            minWidth: "150px",
                            objectFit: "cover",
                          }}
                          className="profile-image"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={0} sm={1} md={1}></Grid>
                    <Grid item xs={12} sm={7} md={7}>
                      <Typography
                        variant="h4"
                        gutterBottom
                        color={theme.palette.text.main}
                      >
                        {organizerInfo.organizerName}
                      </Typography>
                      <Divider />
                      <Typography color={theme.palette.text.main}>
                        {organizerInfo.username}
                        <br></br>({organizerInfo.country})
                      </Typography>
                      {organizerInfo.socials ? (
                        <>
                          <CardActions>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={goToSocials}
                            >
                              {organizerInfo.organizerName}'s Socials
                            </Button>
                          </CardActions>
                        </>
                      ) : null}
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
                    bgcolor: theme.palette.secondary.other,
                    height: "1000px",
                  }}
                  component="footer"
                />
              )}
            </Grid>
          </Container>
        </>

        <MainFooter></MainFooter>
      </Paper>
    </ProtectedComponent>
  );
}
