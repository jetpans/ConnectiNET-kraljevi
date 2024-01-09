import React, { useEffect, useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { green, grey, indigo } from "@mui/material/colors";
import { Divider, Paper } from "@mui/material";
import EventCard from "../ui/EventCard";
import dataController from "../utils/DataController";

import { useUser } from "../context/UserContext";

import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import { useTheme } from "../context/ThemeContext";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import { useSnackbar } from "../context/SnackbarContext";


export default function EventsPage(props) {
  const API_URL = process.env.REACT_APP_API_URL;

  const [cards, setCards] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [cardSize, setCardSize] = useState(12);
  
  const { openSnackbar } = useSnackbar();

  const dc = new dataController();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const accessToken = localStorage.getItem("jwt");
    dc.GetData(API_URL + "/getEvents", accessToken).then((resp) => {
      // console.log("THIS:", resp.data);
      if (resp.data.success === true) {
        // console.log("Cards set to :", resp.data.data);
        setCards(resp.data.data);
      }
    }).catch((e) => {
      console.log(e);
      openSnackbar('error', 'Error fetching Event Data')
    });
  };

  function handleTabChange(event, newValue) {
    setCurrentTab(newValue);
  }

  const { theme, toggleTheme } = useTheme();
  const mainTheme = theme;

  return (
    <ProtectedComponent roles={[0, 1, -1]}>
      <Paper sx={{ bgcolor: mainTheme.palette.background.default }}>
        <CssBaseline />
        <MainHeader for="Events"></MainHeader>
        <>
          {/* Hero unit */}
          <Container sx={{ py: 4 }} maxWidth="lg">
            <Tabs
              variant="fullWidth"
              value={currentTab}
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: {
                  backgroundColor: mainTheme.palette.primary.main
                }
              }}
              textColor="inherit"
            >
              <Tab
                label="Top Picks"
                sx={{ color: mainTheme.palette.text.main }}
              />
              <Tab label="New" sx={{ color: mainTheme.palette.text.main }} />
              <Tab
                label="Near You"
                sx={{ color: mainTheme.palette.text.main }}
              />
            </Tabs>

            <div>
              <br></br>
            </div>

            {currentTab === 0 ? (
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
                      bgcolor: mainTheme.palette.secondary.light,
                      height: "1000px",
                    }}
                    component="footer"
                  />
                )}
              </Grid>
            ) : null}

            {currentTab === 1 ? (
              <Grid container spacing={4}>
                {cards && cards !== null
                  ? cards
                      .slice()
                      .sort((a, b) => {
                        return b.priority - a.priority;
                      })
                      .map((card) => (
                        <Grid item key={card} xs={12} sm={6} md={12}>
                          <EventCard card={card} />
                        </Grid>
                      ))
                  : null}
              </Grid>
            ) : null}

            {currentTab === 2 ? (
              <Grid container spacing={4}>
                {cards && cards !== null
                  ? cards
                      .slice()
                      .sort((a, b) => {
                        return b.time - a.time;
                      })
                      .map((card) => (
                        <Grid item key={card} xs={12} sm={6} md={12}>
                          <EventCard card={card} />
                        </Grid>
                      ))
                  : null}
              </Grid>
            ) : null}
          </Container>
        </>

        {/* Footer */}
        <MainFooter></MainFooter>
        {/* End footer */}
      </Paper>
    </ProtectedComponent>
  );
}
