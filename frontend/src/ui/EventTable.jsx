import React, { useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  Paper,
  Table,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import dataController from "../utils/DataController";
import { useNavigate } from "react-router-dom";
export default function EventTable(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("jwt");
  const dc = new dataController();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const fetchData = async () => {
    dc.GetData(API_URL + "/api/getAllEventsForOrganizer/" + props.accountId, accessToken)
      .then((resp) => {
        console.log("hi");
        console.log(resp.data.data);
        let temp = resp.data.data.map(
          (event) => (event.dateTime = new Date(event.dateTime))
        );
        setEvents(resp.data.data);
        console.log("set events");
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleFilterSubmit = () => {
    const filteredUsers = events.filter(filterFunction);
    console.log("bok");
    console.log(filteredUsers);
    // Now you can use the filteredUsers array as needed
    // Example: setFilteredUsers(filteredUsers);
  };

  const handleFilterByChange = (e) => {
    setFilterBy(e.target.value);
  };
  return (
    <Paper sx={{ padding: "2rem" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          label="Filter"
          onChange={(e) => setFilterValue(e.target.value)}
        ></TextField>
        <TextField
          label="Filter by:"
          select
          defaultValue="username"
          onChange={handleFilterByChange}
        >
          <MenuItem value="username">Username</MenuItem>
          <MenuItem value="organizer">Organizer Name</MenuItem>
          <MenuItem value="firstName">First Name</MenuItem>
        </TextField>
      </div>

      <Table>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Events-type</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>City</TableCell>
          <TableCell>Location</TableCell>
          <TableCell>Price</TableCell>
          <TableCell></TableCell>
        </TableRow>

        {events ? (
          events.map((event) => (
            <TableRow>
              <TableCell>{event.title ? event.title : "-"}</TableCell>
              <TableCell></TableCell>
              <TableCell>
                {event.dateTime ? event.dateTime.toDateString() : "-"}
              </TableCell>
              <TableCell>
                {event.dateTime ? event.dateTime.toLocaleTimeString() : "-"}
              </TableCell>
              <TableCell>{event.city ? event.city : "-"}</TableCell>
              <TableCell>{event.location ? event.location : "-"}</TableCell>
              <TableCell>{event.price ? event.price : "-"}</TableCell>
            </TableRow>
          ))
        ) : (
          <></>
        )}
      </Table>
    </Paper>
  );
}
