import React, { useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  Paper,
  Table,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import dataController from "../utils/DataController";
import { useNavigate } from "react-router-dom";
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
          alert("Successfuly made admin.");
          navigate(0);
        } else {
          alert("Something went wrong.");
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
          alert("Successfuly deleted account.");
          navigate(0);
        } else {
          alert("Something went wrong.");
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
          alert("Successfuly canceled subscription.");
          navigate(0);
        } else {
          alert("Something went wrong.");
        }
      })
      .catch((e) => console.log(e));
  };

  const handleFilterByChange = (e) => {
    setFilterBy(e.target.value);
  };
  return (
    <Paper sx={{ padding: "2rem" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          label="Filter by:"
          select
          defaultValue="username"
          onChange={handleFilterByChange}
          sx={{ marginRight: "2rem" }}
        >
          <MenuItem value="username">Username</MenuItem>
          <MenuItem value="organizer">Organizer Name</MenuItem>
          <MenuItem value="firstName">First Name</MenuItem>
        </TextField>
        <TextField
          label="Filter"
          onChange={(e) => setFilterValue(e.target.value)}
        ></TextField>
      </div>
      <br></br>
      <br></br>
      <Table>
        <TableRow sx={{ backgroundColor: "black", color: "white" }}>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Username</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Role</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>E-Mail</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>First name</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Last name</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Organizer name</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Country</Typography>
          </TableCell>
          <TableCell>
            {" "}
            <Typography sx={{ fontWeight: "bold" }}>Options</Typography>
          </TableCell>
        </TableRow>

        {users ? (
          users.filter(filterFunction).map((user) => (
            <TableRow>
              <TableCell>{user.username ? user.username : "-"}</TableCell>
              <TableCell>
                {user.roleId == 1
                  ? "Organizer"
                  : user.roleId == 0
                  ? "Visitor"
                  : "Administrator"}
              </TableCell>
              <TableCell>{user.eMail ? user.eMail : "-"}</TableCell>
              <TableCell>{user.firstName ? user.firstName : "-"}</TableCell>
              <TableCell>{user.lastName ? user.lastName : "-"}</TableCell>
              <TableCell>
                {user.organizerName ? user.organizerName : "-"}
              </TableCell>
              <TableCell>{user.countryName ? user.countryName : "-"}</TableCell>
              <TableCell>
                {user.roleId == 1 ? (
                  <>
                    {user.events == 1 ? (
                      <Button
                        id={user.accountId}
                        onClick={(e) => handleClickEvents(e)}
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
                    >
                      Make Administrator
                    </Button>{" "}
                    {user.reviews === true ? (
                      <Button
                        id={user.accountId}
                        onClick={(e) => {
                          handleClickReviews(e);
                        }}
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
    </Paper>
  );
}
