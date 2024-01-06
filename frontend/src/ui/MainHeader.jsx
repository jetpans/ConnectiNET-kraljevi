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
  Paper,
  Container,
  Grid
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import TableRowsIcon from "@mui/icons-material/TableRows";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useTheme } from "../context/ThemeContext";
import { useDialog } from "../context/DialogContext";
import AddCardIcon from '@mui/icons-material/AddCard';

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

  const { theme, toggleTheme } = useTheme();
  const { dialogComponent, isDialogOpen, openDialog, closeDialog } = useDialog();
  const dialogContent = (
    <Paper>
      <div className="dialog-content">
        <Container sx={{ py: 4 }} maxWidth="lg" width="100px">
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h6">Dialog Test Dialog Test Dialog Test</Typography>
            <br />
            <br />
            <br />
          </Grid>
          <Button onClick={closeDialog} variant="contained">Close</Button>
        </Container>
      </div>
    </Paper>
  );
  const handleOpenDialog = () => {
    openDialog(dialogContent);
  }

  return (
    <div>
      <AppBar position="relative" sx={{ bgcolor: theme.palette.primary.main}}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={toggleDrawer}>
            <TableRowsIcon sx={{ color: theme.palette.secondary.light }} />
          </Button>

          <Typography
            variant="h5"
            color={theme.palette.secondary.light}
            noWrap
          >
            {props.for}
          </Typography>

          <div>
            <Button onClick={handleOpenDialog}>
              <AddCardIcon sx={{ color: theme.palette.secondary.light }} />
            </Button>
            <Button onClick={toggleTheme}>
              <Brightness4Icon sx={{ color: theme.palette.secondary.light }} />
            </Button>
            <Button onClick={handleLogout}>
              <LogoutIcon sx={{ color: theme.palette.secondary.light }} />
            </Button>

            {/* <Typography variant="h6" color={theme.palette.secondary.light}>
              Log out
            </Typography> */}
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
