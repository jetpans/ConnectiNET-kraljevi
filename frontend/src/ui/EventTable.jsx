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
export default function EventTable(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("jwt");
  const dc = new dataController();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

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
          alert("Successfuly deleted event.");
          navigate(0);
        } else {
          alert("Faield to delete event.");
        }
      })
      .catch((e) => alert(e));
  };

  return (
    <Paper sx={{ padding: "2rem" }}>
      <Table>
        <TableRow sx={{ bgcolor: "black", color: "white" }}>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Event name</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Organizer</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Date</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Time</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>City</Typography>
          </TableCell>

          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Price</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Country</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold" }}>Options</Typography>
          </TableCell>
        </TableRow>

        {events ? (
          events.map((event) => (
            <TableRow>
              <TableCell>{event.title ? event.title : "-"}</TableCell>
              <TableCell>{event.organizerName}</TableCell>
              <TableCell>
                {event.dateTime ? event.dateTime.toDateString() : "-"}
              </TableCell>
              <TableCell>
                {event.dateTime ? event.dateTime.toLocaleTimeString() : "-"}
              </TableCell>
              <TableCell>{event.city ? event.city : "-"}</TableCell>
              <TableCell>{event.price ? event.price : "-"}</TableCell>
              <TableCell>{event.countryName}</TableCell>
              <TableCell>
                <Button
                  id={event.eventId}
                  onClick={(e) => handleDeleteEvent(e)}
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
    </Paper>
  );
}
