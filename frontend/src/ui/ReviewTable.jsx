import React, { useEffect, useState } from "react";
import {
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

export default function ReviewTable(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("jwt");
  const dc = new dataController();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);

  const { openSnackbar } = useSnackbar();

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
          openSnackbar("success", "Successfuly deleted review.");
          navigate(0);
        } else {
          openSnackbar("error", "Faield to delete review.");
        }
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    fetchData();
  }, []);

  const { theme, toggleTheme } = useTheme();

  return (
    <Paper sx={{ bgcolor: theme.palette.background.defaut }}>
      <TableContainer 
        sx={{
          bgcolor: theme.palette.background.table,
          padding: "2rem",
      }}>
      <Table sx={{bgcolor: theme.palette.background.defaut}}>
        <TableRow sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Username</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Event name</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Comment</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Date</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Time</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Options</Typography>
          </TableCell>
        </TableRow>

        {reviews ? (
          reviews.map((review) => (
            <TableRow>
              <TableCell sx={{color: theme.palette.text.main}}>{review.username}</TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>{review.eventName}</TableCell>

              <TableCell sx={{color: theme.palette.text.main}}>{review.comment ? review.comment : "-"}</TableCell>

              <TableCell sx={{color: theme.palette.text.main}}>
                {review.dateTime ? review.dateTime.toDateString() : "-"}
              </TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>
                {review.dateTime ? review.dateTime.toLocaleTimeString() : "-"}
              </TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>
                <Button id={review.reviewId} onClick={(e) => deleteReview(e)} sx={{color: theme.palette.primary.main}}>
                  Delete review
                </Button>
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
