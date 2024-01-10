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

export default function EventTable(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("jwt");
  const dc = new dataController();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const { openSnackbar } = useSnackbar();

  const fetchData = async () => {
    dc.GetData(
      API_URL + "/api/getAllEventsForOrganizer/" + props.accountId,
      accessToken
    )
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

  const handleDeleteEvent = (event) => {
    dc.PostData(
      API_URL + "/api/admin/deleteEvent/" + event.target.id,
      "",
      accessToken
    )
      .then((resp) => {
        if (resp.success === true) {
          openSnackbar("success", "Successfuly deleted event.");
          navigate(0);
        } else {
          openSnackbar("error", "Faield to delete event.");
        }
      })
      .catch((e) => console.log(e));
  };

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
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Event name</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Organizer</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Date</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Time</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>City</Typography>
          </TableCell>

          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Price</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Country</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }} color={theme.palette.text.white}>Options</Typography>
          </TableCell>
        </TableRow>

        {events ? (
          events.map((event) => (
            <TableRow>
              <TableCell sx={{color: theme.palette.text.main}}>{event.title ? event.title : "-"}</TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>{event.organizerName}</TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>
                {event.dateTime ? event.dateTime.toDateString() : "-"}
              </TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>
                {event.dateTime ? event.dateTime.toLocaleTimeString() : "-"}
              </TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>{event.city ? event.city : "-"}</TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>{event.price ? event.price : "-"}</TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>{event.countryName}</TableCell>
              <TableCell sx={{color: theme.palette.text.main}}>
                <Button
                  id={event.eventId}
                  onClick={(e) => handleDeleteEvent(e)}
                  sx={{color: theme.palette.primary.main}}
                >
                  Delete event
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
