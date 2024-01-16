import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Chip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { browserHistory } from "react-router";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserUploadedImage from "./UserUploadedImage";
import { useTheme } from "../context/ThemeContext";
import { useDialog } from "../context/DialogContext";
import EventDetail from "../views/EventDetail";
import UserUploadedEventImage from "./UserUploadedEventImage";
import { Divider } from "@mui/material";

export default function EventCard(props) {
  const { card } = props;
  const { theme, toggleTheme } = useTheme();
  const maxDescriptionLength = 150;
  const { openDialog, closeDialog } = useDialog();
  const navigate = useNavigate();

  const handleCloseAndReroute = (path) => {
    closeDialog();
    navigate(path);
  };

  function displayEvent() {
    openDialog(
      <EventDetail
        event={card}
        closeDialog={closeDialog}
        closeDialogExtended={(path) => {
          handleCloseAndReroute(path);
        }}
      />
    );

    // navigate("/event", {state: {event: card}});
  }

  function editEvent() {
    navigate("/edit/" + card.id);
  }

  useEffect(() => {
    console.log(props.card);
  });

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text,
        marginTop: "0px",
      }}
      elevation={24}
      onMouseEnter={() => {
        /*console.log("Mouse enter")*/
      }}
    >
      <CardMedia key={card.id} />
      <img
        style={{ objectFit: "cover", height: card.image ? "20vh" : 0 }}
        src={card.image}
      />
      <CardContent sx={{ flexGrow: 1 }} key={card.id}>
        {/* <img src={card.image}></img> */}
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          color={theme.palette.text.main}
        >
          {card.title}
        </Typography>
        {/* <Typography color={theme.palette.text.light} marginTop={1} marginBottom={1}>
          {card.description.length > maxDescriptionLength
            ? `${card.description.slice(0, maxDescriptionLength)}...`
            : card.description}
        </Typography> */}
        <Typography color={theme.palette.text.light} marginBottom={1}>
          By{" "}
          <Button onClick={() => navigate("/organizer/" + card.accountId)} sx={{color: theme.palette.primary.main}}>
            {card.organizer}
          </Button>
        </Typography>
        <Divider />

        <Typography color={theme.palette.text.light} marginTop={1}>
          {card.city}
        </Typography>
        <Typography color={theme.palette.text.light}>
          {card.time.slice(0, 10)}
        </Typography>

        <Typography color={theme.palette.text.light}>{card.type}</Typography>

        {/* <Typography >
                    {"Interest: " + card.interest}
                </Typography>  */}
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Button size="small">
            <Typography
              onClick={displayEvent}
              variant="body1"
              color={theme.palette.primary.main}
              style={{ textTransform: "none" }}
            >
              See More
            </Typography>
          </Button>
          {card.my_event ? (
            <>
              <Button size="small">
                <Typography
                  onClick={editEvent}
                  variant="body1"
                  color={theme.palette.primary.main}
                  style={{ textTransform: "none" }}
                >
                  Edit
                </Typography>
              </Button>
            </>
          ) : null}
        </div>
        <Chip
          label={card.price === 0 ? "Free" : card.price + " €"}
          sx={{
            bgcolor: theme.palette.secondary,
            fontSize: "1.3rem",
            padding: "0.5rem",
            color: theme.palette.text.light
          }}
        ></Chip>
      </CardActions>
    </Card>
  );
}
