import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EventIcon from "@mui/icons-material/Event";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import TableRowsIcon from "@mui/icons-material/TableRows";
import LogoutIcon from "@mui/icons-material/Logout";
import { green, grey, indigo } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Divider, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EventCard from "../ui/EventCard";
import dataController from "../utils/DataController";

import { useUser } from "../context/UserContext";

import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
export default function EventsPage(props) {
  const API_URL = process.env.REACT_APP_API_URL;

  const [cards, setCards] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [cardSize, setCardSize] = useState(12);
  const navigate = useNavigate();

  const { user, updateUser, logout, loading } = useUser();

  const dc = new dataController();

  const fetchData = async () => {
    const accessToken = localStorage.getItem("jwt");
    dc.GetData(API_URL + "/getEvents", accessToken).then((resp) => {
      // console.log("THIS:", resp.data);
      if (resp.data.success === true) {
        // console.log("Cards set to :", resp.data.data);
        setCards(resp.data.data);
      }
    });
  };

  function handleTabChange(event, newValue) {
    setCurrentTab(newValue);
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
        <MainHeader></MainHeader>
        <>
          {/* Hero unit */}
          <Container sx={{ py: 4 }} maxWidth="lg">
            <Tabs
              variant="fullWidth"
              value={currentTab}
              onChange={handleTabChange}
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
                      bgcolor: mainTheme.palette.secondary.other,
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
      </ThemeProvider>
    </Paper>
  );
}
