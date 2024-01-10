import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import dataController from "../utils/DataController";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSnackbar } from "../context/SnackbarContext";


export default function UserTable() {
  const API_URL = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("jwt");
  const dc = new dataController();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    dc.GetData(API_URL + "/api/getAllUsers", accessToken)
      .then((resp) => {
        console.log(resp.data.data);
        setUsers(resp.data.data);
        console.log("set users");
      })
      .catch((e) => console.log(e));
  };

  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    fetchData();
  }, []);
  /*
  const users = [
    {
      username: 'johndoe123',
      roleId: 1,
      eMail: 'johndoe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      organizerName: 'ABC Events',
      countryName: 'United States',
    },
    {
      username: 'janedoe456',
      roleId: 0,
      eMail: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      organizerName: 'XYZ Conferences',
      countryName: 'Canada',
    },
    {
      username: 'alexsmith789',
      roleId: 2,
      eMail: 'alex@example.com',
      firstName: 'Alex',
      lastName: 'Smith',
      organizerName: 'Event Planners Inc.',
      countryName: 'Australia',
    },
  ];
*/
  const [filterValue, setFilterValue] = useState("");
  const [filterBy, setFilterBy] = useState("username");

  const filterFunction = (user) => {
    switch (filterBy) {
      case "username":
        return user.username.toLowerCase().includes(filterValue.toLowerCase());
      case "organizer":
        if (user.organizerName !== undefined)
          return user.organizerName
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        return;
      case "firstName":
        if (user.firstName !== undefined)
          return user.firstName
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        return;
      default:
        return true; // If no specific filterBy is selected, include all users
    }
  };

  const handleClickEvents = (event) => {
    let accountId = event.target.id;
    navigate("/admin/browseEvents/" + accountId);
  };
  const handleClickReviews = (event) => {
    let accountId = event.target.id;
    console.log(event.target.id);
    navigate("/admin/browseReviews/" + accountId);
  };

  const handleMakeAdmin = (e) => {
    e.preventDefault();
    let accountId = e.target.id;

    dc.PostData(API_URL + "/api/admin/makeAdmin/" + accountId, "", accessToken)
      .then((resp) => {
        if (resp.data.success === true) {
          openSnackbar("success", "Successfuly made admin.");
          navigate(0);
        } else {
          openSnackbar("error", "Something went wrong.");
        }
      })
      .catch((e) => console.log(e));
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    let accountId = e.target.id;

    dc.PostData(
      API_URL + "/api/admin/deleteAccount/" + accountId,
      "",
      accessToken
    )
      .then((resp) => {
        if (resp.data.success === true) {
          openSnackbar("success", "Successfuly deleted account.");
          navigate(0);
        } else {
          openSnackbar("error", "Something went wrong.");
        }
      })
      .catch((e) => console.log(e));
  };

  const handleCancelSubscription = (e) => {
    e.preventDefault();
    let accountId = e.target.id;

    dc.PostData(
      API_URL + "/api/admin/cancelSubscription/" + accountId,
      "",
      accessToken
    )
      .then((resp) => {
        if (resp.data.success === true) {
          openSnackbar("success", "Successfuly canceled subscription.");
          navigate(0);
        } else {
          openSnackbar("error", "Something went wrong.");
        }
      })
      .catch((e) => console.log(e));
  };

  const handleFilterByChange = (e) => {
    setFilterBy(e.target.value);
  };

  const { theme, toggleTheme } = useTheme();

  return (
    <Paper sx={{ bgcolor: theme.palette.background.defaut }} >
      <TableContainer 
        sx={{
          bgcolor: theme.palette.background.table,
          padding: "2rem",
      }}>
      <Box sx={{ display: "flex", flexDirection: "row", bgcolor: theme.palette.background.defaut, input: { color: theme.palette.text.main }, label: { color: theme.palette.text.main } }}>
        <TextField
          label="Filter by:"
          select
          defaultValue="username"
          onChange={handleFilterByChange}
          sx={{ marginRight: "2rem", bgcolor: theme.palette.background.defaut, input: { color: theme.palette.text.main }, '& .MuiInputBase-root': {
            color: theme.palette.text.main, // Set text color of the TextField input
          } }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  backgroundColor: theme.palette.background.default,
                },
              },
            },
          }}  
        >
          <MenuItem value="username" sx={{ color: theme.palette.text.main }}>Username</MenuItem>
          <MenuItem value="organizer" sx={{ color: theme.palette.text.main }}>Organizer Name</MenuItem>
          <MenuItem value="firstName" sx={{ color: theme.palette.text.main }}>First Name</MenuItem>
        </TextField>
        <TextField
          label="Filter"
          onChange={(e) => setFilterValue(e.target.value)}
        ></TextField>
      </Box>
      <br></br>
      <br></br>
      
      <Table sx={{bgcolor: theme.palette.background.defaut}}>
        <TableRow sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Username</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Role</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>E-Mail</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>First name</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Last name</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Organizer name</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Country</Typography>
          </TableCell>
          <TableCell>
            {" "}
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Options</Typography>
          </TableCell>
        </TableRow>

        {users ? (
          users.filter(filterFunction).map((user) => (
            <TableRow>
              <TableCell sx={{color: theme.palette.text.main}}>{user.username ? user.username : "-"}</TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>
                {user.roleId == 1
                  ? "Organizer"
                  : user.roleId == 0
                  ? "Visitor"
                  : "Administrator"}
              </TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>{user.eMail ? user.eMail : "-"}</TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>{user.firstName ? user.firstName : "-"}</TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>{user.lastName ? user.lastName : "-"}</TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>
                {user.organizerName ? user.organizerName : "-"}
              </TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>{user.countryName ? user.countryName : "-"}</TableCell>
              <TableCell>
                {user.roleId == 1 ? (
                  <>
                    {user.events == 1 ? (
                      <Button
                        id={user.accountId}
                        onClick={(e) => handleClickEvents(e)}
                        sx={{color: theme.palette.primary.main}}
                      >
                        Browse events
                      </Button>
                    ) : null}{" "}
                    {user.subscription == 1 ? (
                      <Button
                        id={user.accountId}
                        onClick={(e) => {
                          handleCancelSubscription(e);
                        }}
                        sx={{color: theme.palette.primary.main}}
                      >
                        Cancel subscription
                      </Button>
                    ) : null}
                  </>
                ) : user.roleId == 0 ? (
                  <>
                    <Button
                      id={user.accountId}
                      onClick={(e) => handleMakeAdmin(e)}
                      sx={{color: theme.palette.primary.main}}
                    >
                      Make Administrator
                    </Button>{" "}
                    {user.reviews === true ? (
                      <Button
                        id={user.accountId}
                        onClick={(e) => {
                          handleClickReviews(e);
                        }}
                        sx={{color: theme.palette.primary.main}}
                      >
                        Browse reviews
                      </Button>
                    ) : (
                      <></>
                    )}
                    <Button
                      id={user.accountId}
                      onClick={(e) => {
                        handleDeleteAccount(e);
                      }}
                      sx={{color: theme.palette.primary.main}}
                    >
                      Delete account
                    </Button>
                  </>
                ) : null}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <></>
        )}
      </Table>
      </TableContainer>
    </Paper>
  );
}
