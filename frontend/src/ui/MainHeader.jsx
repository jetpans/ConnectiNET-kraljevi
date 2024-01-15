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
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import TableRowsIcon from "@mui/icons-material/TableRows";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useTheme } from "../context/ThemeContext";
import { useDialog } from "../context/DialogContext";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import AddCardIcon from "@mui/icons-material/AddCard";
import GroupsIcon from '@mui/icons-material/Groups';
import { useSnackbar } from "../context/SnackbarContext";
import UserUploadedAvatar from "./UserUploadedAvatar";
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import NotificationsIcon from '@mui/icons-material/Notifications';


export default function MainHeader(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, updateUser, logout, loading } = useUser();
  const navigate = useNavigate();

  const [tabs, setTabs] = useState(
      user === null ? ["Events"] :
      user.roleId === 0 ? ["Events", "Account"] 
    : user.roleId === 1 ? ["Profile", "Events", "Create New Event", "Account", "ConnectiNET Premium"/**, "Temp" */]
    : user.roleId === -1 ? ["Profile", "Events", /** "My Events", */ "Account", "ConnectiNET Premium"/**, "Temp" */, "Browse Users", "Change Subscription Price"]
    : ["Events"]); 

  const [profileImage, setProfileImage] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotification, setAnchorElNotification] = useState(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuCloseNotification = () => {
    setAnchorElNotification(null);
  };

  useEffect(() => {
    setTabs(
      user === null ? ["Events"] :
      user.roleId === 0 ? ["Events", "Account"] 
    : user.roleId === 1 ? ["Profile", "Events", "Create New Event", "Account", "ConnectiNET Premium"/**, "Temp" */]
    : user.roleId === -1 ? ["Events", "Account", "Browse Users", "Change Subscription Price"]
    : ["Events"]); 
  }, [user])

  const dc = new dataController();

  function handleTabChange(event) {
    const value = event.currentTarget.getAttribute("value");
    switch (value) {
      case "Account":
        navigate("/account");
        break;

      case "Events":
        navigate("/events");
        break;

      case "ConnectiNET Premium":
        navigate("/premium");
        break;

      case "Create New Event":
        navigate("/create");
        break;

      case "Profile":
        navigate("/organizer/" + user.id);
        break;

      case "Browse Users":
        navigate("/admin/browseUsers");
        break;

      case "Change Subscription Price":
        navigate("/admin/subscription");
        break;
    }
  }

  function toggleDrawer() {
    setDrawerOpen((prevState) => !prevState);
  }

  function handleLogout() {
    dc.PostData(API_URL + "/logout")
      .then((resp) => {
        if (resp.success === true) {
          logout();
          navigate("/login");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("jwt");
    if (accessToken === null) {
      navigate("/login");
    }
  }, []);

  const { theme, toggleTheme } = useTheme();

  const handleOpenMenu = () => {
    setAnchorEl(document.getElementById("profile-image"));
  };
  const handleOpenMenuNotification = () => {
    setAnchorElNotification(document.getElementById("notification-icon"));
  };

  useEffect(() => {
    if (user && user !== null && user.profileImage) {
      console.log(user.profileImage);
      setProfileImage(user.profileImage);
    }
  }, [user]);

  return (
    <div>
      <AppBar position="relative" sx={{ bgcolor: theme.palette.primary.main }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={toggleDrawer}>
            <TableRowsIcon sx={{ color: theme.palette.secondary.light }} />
          </Button>

          <Typography variant="h5" color={theme.palette.secondary.light} noWrap>
            {props.for}
          </Typography>

          <div>
            <Button onClick={toggleTheme} id="change-color-button">
              <Brightness4Icon sx={{ color: "#FFF" }} />
            </Button>
            <Button onClick={handleOpenMenuNotification} id="notification-icon">
              <NotificationsIcon sx={{ color: "#FFF" }} />
            </Button>
            <Menu
              id="notifications-menu"
              anchorEl={anchorElNotification}
              open={Boolean(anchorElNotification)}
              onClose={handleMenuCloseNotification}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {}}
              >
                <Typography marginRight={2}>Notification1</Typography>
              </MenuItem>
              <MenuItem onClick={() => {}}>
                <Typography marginRight={1}>Notification2</Typography>
              </MenuItem>
            </Menu>
            <Button onClick={handleOpenMenu} id="profile-image">
              <UserUploadedAvatar src={profileImage}></UserUploadedAvatar>
            </Button>
            {/* <Avatar alt="User Profile Picture" src={"/" + user.profileImage ? user.profileImage : ""} /> */}
            {/* <Button onClick={handleLogout}>
              <LogoutIcon sx={{ color: theme.palette.secondary.light }} />
            </Button> */}
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/account");
                }}
              >
                <Typography marginRight={2}>Account</Typography>
                <ManageAccountsIcon
                  marginBottom={1}
                  htmlColor={theme.palette.secondary.dark}
                />
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography marginRight={3}>Log Out</Typography>
                <LogoutIcon
                  marginBottom={1}
                  htmlColor={theme.palette.secondary.dark}
                />
              </MenuItem>
            </Menu>

            {/* <Typography variant="h6" color={theme.palette.secondary.light}>
              Log out
            </Typography> */}
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        open={drawerOpen}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.main,
          },
        }}
      >
        <Button onClick={toggleDrawer}>
          <TableRowsIcon sx={{ color: theme.palette.text.light }} />
        </Button>
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
                  <ListItemIcon
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.light,
                    }}
                  >
                    {text === "Events" ? (
                      <EventIcon />
                    ) : text === "Account" ? (
                      <ManageAccountsIcon />
                    ) : text === "ConnectiNET Premium" ? (
                      <WorkspacePremiumIcon />
                    ) : text === "Profile" ? (
                      <AccountCircleIcon />
                    ) : text === "My Events" ? (
                      <EditCalendarIcon />
                    ) : text === "Create New Event" ? (
                      <BookmarkAddIcon />
                    ) : text === "Browse Users" ? (
                      <GroupsIcon />
                    ) : text === "Change Subscription Price" ? (
                      <PriceChangeIcon />
                    ) : null}
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
