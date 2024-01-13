import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Navigate } from "react-router-dom";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import dataController from "../utils/DataController";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import EventCard from "../ui/EventCard";
import Container from "@mui/material/Container";
import UserUploadedImage from "../ui/UserUploadedImage";
import UserUploadedEventImage from "../ui/UserUploadedEventImage";
import { Divider, Paper } from "@mui/material";
import CommentBlock from "../ui/CommentBlock";
import { useTheme } from "../context/ThemeContext";

export default function EventDetail(props) {
  console.log(props);

  const MAX_COMMENT_LENGTH = 150;

  const API_URL = process.env.REACT_APP_API_URL;

  const [cards, setCards] = useState(null);
  const [comments, setComments] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showLimitedComments, setShowLimitedComments] = useState(true);

  // const handleShowAllComments = () => {
  //      setShowAllComments(true);
  // };

  const toggleShowAllComments = () => {
    setShowAllComments(!showAllComments);
    setShowLimitedComments(!showLimitedComments); // Prebacujemo prikaz na ograničeni ako je bio prikazan cijeli, i obrnuto
  };

  const allComments =
    comments && comments !== null
      ? comments.map((comment) => (
          <li>
            {comment.length > MAX_COMMENT_LENGTH
              ? `${comment.slice(0, MAX_COMMENT_LENGTH)}...`
              : comment}
          </li>
        ))
      : null;

  let limitedComments = null;
  if (Array.isArray(comments)) {
    limitedComments = comments
      .slice(0, 3)
      .map((comment, index) => (
        <li key={index}>
          {comment.length > MAX_COMMENT_LENGTH
            ? `${comment.slice(0, MAX_COMMENT_LENGTH)}...`
            : comment}
        </li>
      ));
  }

  const handleCloseWithReroute = (path) => {
    props.closeDialogExtended(path);
  };

  const dc = new dataController();

  const fetchData = async () => {
    if (props && props.event) {
      const accessToken = localStorage.getItem("jwt");
      dc.GetData(API_URL + "/getEvent/" + props.event.id, accessToken)
        .then((resp) => {
          // console.log("THIS:", resp.data);
          if (resp.data.success === true) {
            // console.log("Cards set to :", resp.data.data);
            setCards(resp.data.data);
            setComments(resp.data.comments.map((comment) => comment.comment));
            setReviews(resp.data.comments);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [props]);

  const { theme, toggleTheme } = useTheme();

  return (
    <Box sx={{ overflowY: "scroll", maxHeight: "90vh", width: "70vw" }}>
      {props &&
      props.event &&
      props.closeDialog &&
      cards &&
      cards.id != null ? (
        <Container maxWidth="lg">
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: theme.palette.background.default,
              color: theme.palette.text,
              width: "60vw",
            }}
            elevation={24}
            onMouseEnter={() => {
              /*console.log("Mouse enter")*/
            }}
          >
            <CardMedia
              component="div"
              key={cards.id}
              sx={{
                position: "relative",
                pt: "2.5%",
                marginTop: 0,
                padding: 0,
                overflowY: "scroll",
                marginBottom: 0,
              }}
            >
              <Box sx={{ marginBottom: 0 }}>
                <div
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    position: "absolute",
                    bottom: 0,
                    left: 30,
                  }}
                >
                  <UserUploadedImage
                    src={cards.image_org}
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>
                <div>
                  <UserUploadedEventImage src={props.event.image} />
                </div>
              </Box>
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }} key={props.event.id}>
              <Typography
                gutterBottom
                variant="h3"
                sx={{ marginBottom: 0 }}
                color={theme.palette.text.main}
              >
                {cards.title}
              </Typography>
              <Button
                variant="h5"
                sx={{
                  marginBottom: 3,
                  color: theme.palette.primary.main,
                  marginLeft: 0,
                  paddingLeft: 0,
                }}
                onClick={() => {
                  handleCloseWithReroute("/organizer/" + cards.accountId);
                }}
              >
                {cards.organizer}
                {/* <Link to={"/organizer/" + cards.accountId} /> */}
              </Button>
              <Divider sx={{ bgcolor: theme.palette.text.main }} />
              <Typography variant="body1" color={theme.palette.text.main}>
                {"Interested:" +
                  cards.interested +
                  " | Maybe:" +
                  cards.maybe +
                  " | Not interested:" +
                  cards.nointerest}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 3,
                  marginTop: 3,
                  display: "flex",
                  justifyContent: "right",
                }}
                color={theme.palette.text.main}
              >
                {"Description: "}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: 3,
                  marginTop: 3,
                  display: "flex",
                  justifyContent: "right",
                }}
                color={theme.palette.text.main}
              >
                {cards.description}
              </Typography>
              <Divider sx={{ bgcolor: theme.palette.text.main }} />
              <Typography
                variant="h6"
                sx={{ marginTop: 3 }}
                color={theme.palette.text.main}
              >
                {"Comments: "}
              </Typography>
              {reviews && reviews !== null
                ? showLimitedComments
                  ? reviews.slice(0, 3).map((review) => {
                      return (
                        <CommentBlock
                          author={review.firstName + " " + review.lastName}
                          content={review.comment}
                          timestamp={review.time}
                        ></CommentBlock>
                      );
                    })
                  : showAllComments
                  ? reviews.map((review) => {
                      return (
                        <CommentBlock
                          author={review.firstName + " " + review.lastName}
                          content={review.comment}
                          timestamp={review.time}
                        ></CommentBlock>
                      );
                    })
                  : null
                : null}
              <Typography variant="body1">
                {/* {showAllComments ? allComments : limitedComments} */}
                {showLimitedComments &&
                  comments &&
                  comments !== null &&
                  comments.length > 3 && (
                    <Button
                      onClick={toggleShowAllComments}
                      sx={{ color: theme.palette.primary.main }}
                    >
                      Show all Comments
                    </Button>
                  )}
                {showAllComments && (
                  <Button
                    onClick={toggleShowAllComments}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    Hide comments
                  </Button>
                )}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                onClick={() => props.closeDialog()}
                variant="contained"
                sx={{ bgcolor: theme.palette.primary.main }}
              >
                Back
              </Button>
            </CardActions>
          </Card>
        </Container>
      ) : null}
    </Box>
  );
}
