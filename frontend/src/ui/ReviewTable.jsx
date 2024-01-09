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
export default function ReviewTable(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("jwt");
  const dc = new dataController();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);

  const fetchData = async () => {
    dc.GetData(API_URL + "/api/getAllReviewsForEvent/" + props.eventId, accessToken)
      .then((resp) => {
        console.log("hi");
        console.log(resp.data.data);
        let temp = resp.data.data.map(
          (review) => (review.dateTime = new Date(review.dateTime))
        );
        setReviews(resp.data.data);
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
    const filteredUsers = reviews.filter(filterFunction);
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
          <TableCell>Comment</TableCell>
          <TableCell>Review Id</TableCell>
          <TableCell>Account Id</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Time</TableCell>
          
        </TableRow>

        {reviews ? (
          reviews.map((review) => (
            <TableRow>
              <TableCell>{review.comment ? review.comment : "-"}</TableCell>
              <TableCell>{review.reviewId ? review.reviewId : "-"}</TableCell>
              <TableCell>{review.accountId ? review.accountId : "-"}</TableCell>
              <TableCell>
                {review.dateTime ? review.dateTime.toDateString() : "-"}
              </TableCell>
              <TableCell>
                {review.dateTime ? review.dateTime.toLocaleTimeString() : "-"}
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
