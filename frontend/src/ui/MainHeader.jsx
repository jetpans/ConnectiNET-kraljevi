import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import dataController from "../utils/DataController";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Drawer,
  Box,
  List,
  ListItem,
  Divider,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import TableRowsIcon from "@mui/icons-material/TableRows";
import LogoutIcon from "@mui/icons-material/Logout";
import { createTheme } from "@mui/material/styles";
import { green, grey, indigo } from "@mui/material/colors";

export default function MainHeader(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const tabs = ["Profile", "Events", "My Events", "Account", "Temp"];
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();

  const { user, updateUser, logout, loading } = useUser();

  const dc = new dataController();

  function handleTabChange(event) {
    const value = event.currentTarget.getAttribute("value");
    switch (value) {
      case "Account":
        navigate("/account");
        break;
      case "Temp":
        navigate("/temp");
        break;
      case "Events":
        navigate("/events");
        break;
    }
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
    const accessToken = localStorage.getItem("jwt");
    if (accessToken === null) {
      navigate("/login");
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
    <div>
      <AppBar position="relative">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={toggleDrawer}>
            <TableRowsIcon sx={{ color: mainTheme.palette.secondary.other }} />
          </Button>

          <Typography
            variant="h5"
            color={mainTheme.palette.secondary.other}
            noWrap
          >
            {props.for}
          </Typography>

          <div>
            <Button onClick={handleLogout}>
              <LogoutIcon sx={{ color: mainTheme.palette.secondary.other }} />
            </Button>
            <Typography variant="h6" color={mainTheme.palette.secondary.other}>
              Log out
            </Typography>
          </div>
        </Toolbar>
      </AppBar>

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
            {tabs.map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  name="text"
                  value={text}
                  onClick={(e) => handleTabChange(e)}
                >
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
    </div>
  );
}
