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
export default function ReviewTable(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("jwt");
  const dc = new dataController();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);

  const fetchData = async () => {
    dc.GetData(
      API_URL + "/api/getAllReviewsForAccount/" + props.accountId,
      accessToken
    )
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

  const deleteReview = (e) => {
    dc.PostData(
      API_URL + "/api/admin/deleteReview/" + e.target.id,
      "",
      accessToken
    )
      .then((resp) => {
        if (resp.success === true) {
          alert("Successfuly deleted review.");
          navigate(0);
        } else {
          alert("Faield to delete review.");
        }
      })
      .catch((e) => alert(e));
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Paper sx={{ padding: "2rem" }}>
      <Table>
        <TableRow sx={{ backgroundColor: "black", color: "white" }}>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Username</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Event name</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Comment</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Date</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Time</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Options</Typography>
          </TableCell>
        </TableRow>

        {reviews ? (
          reviews.map((review) => (
            <TableRow>
              <TableCell>{review.username}</TableCell>
              <TableCell>{review.eventName}</TableCell>

              <TableCell>{review.comment ? review.comment : "-"}</TableCell>

              <TableCell>
                {review.dateTime ? review.dateTime.toDateString() : "-"}
              </TableCell>
              <TableCell>
                {review.dateTime ? review.dateTime.toLocaleTimeString() : "-"}
              </TableCell>
              <TableCell>
                <Button id={review.reviewId} onClick={(e) => deleteReview(e)}>
                  Delete review
                </Button>
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
