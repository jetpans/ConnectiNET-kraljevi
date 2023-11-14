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

export default function EventsPage() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [cards, setCards] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cardSize, setCardSize] = useState(12);
  const navigate = useNavigate();

  const { user, updateUser, logout } = useUser();

  const dc = new dataController();

  const fetchData = async () => {
    // try {
    // const resp = await fetch("http://127.0.0.1:5000/getEvents", { method: "GET" });
    // if (resp.ok) {
    // const respJson = await resp.json();
    // setCards(respJson);
    // }
    // } catch {
    // console.error("Bad!");
    // }
    dc.GetData(API_URL + "/getEvents").then((resp) => {
      console.log("THIS:", resp.data);
      if (resp.data.data.success) {
        console.log("Cards set to :", resp.data.data);
        setCards(resp.data);
      }
    });
  };

  function handleTabChange(event, newValue) {
    setCurrentTab(newValue);
  }

  function toggleDrawer() {
    setDrawerOpen((prevState) => !prevState);
  }

  function handleLogout() {
    dc.PostData(API_URL + "/logout").then((resp) => {
      if (resp.success === true) {
        logout();
        navigate("/login");
      }
    });
  }

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);

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
        <AppBar position="relative">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={toggleDrawer}>
              <TableRowsIcon
                sx={{ color: mainTheme.palette.secondary.other }}
              />
            </Button>

            <Typography
              variant="h5"
              color={mainTheme.palette.secondary.other}
              noWrap
            >
              Events
            </Typography>

            <div>
              <Button onClick={handleLogout}>
                <LogoutIcon sx={{ color: mainTheme.palette.secondary.other }} />
              </Button>
              <Typography
                variant="h6"
                color={mainTheme.palette.secondary.other}
              >
                Log out
              </Typography>
            </div>
          </Toolbar>
        </AppBar>
        <>
          <Drawer open={drawerOpen} onClose={toggleDrawer}>
            <Typography variant="h5" sx={{ textAlign: "center", mt: 2, mb: 2 }}>
              ConnectiNET
            </Typography>
            <Box
              sx={{ width: 350 }}
              // nClick={toggleDrawer}
              onKeyDown={toggleDrawer}
            >
              <div />
              <Divider />
              <List>
                {["Profile", "Events", "My Events"].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        {index === 1 ? (
                          <EventIcon />
                        ) : index === 0 ? (
                          <AccountCircleIcon />
                        ) : (
                          <EditCalendarIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>

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
        <Box
          sx={{ bgcolor: mainTheme.palette.primary.main, p: 4.5 }}
          component="footer"
        >
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            color={mainTheme.palette.secondary.other}
          >
            ConnectiNET
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color={mainTheme.palette.secondary.other}
          >
            by Kraljevi
          </Typography>
        </Box>
        {/* End footer */}
      </ThemeProvider>
    </Paper>
  );
}
