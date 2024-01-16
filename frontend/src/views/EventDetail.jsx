import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Navigate } from "react-router-dom";
import Button from "@mui/material/Button";
import React, { useEffect, useRef, useState } from "react";
import dataController from "../utils/DataController";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import EventCard from "../ui/EventCard";
import Container from "@mui/material/Container";
import UserUploadedImage from "../ui/UserUploadedImage";
import UserUploadedEventImage from "../ui/UserUploadedEventImage";
import {
  Chip,
  Divider,
  Paper,
  TextField,
  ImageList,
  ImageListItem,
} from "@mui/material";
import CommentBlock from "../ui/CommentBlock";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { useSnackbar } from "../context/SnackbarContext";

export default function EventDetail(props) {
  const MAX_COMMENT_LENGTH = 150;

  const API_URL = process.env.REACT_APP_API_URL;

  const [cards, setCards] = useState(null);
  const [comments, setComments] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showLimitedComments, setShowLimitedComments] = useState(true);
  const [media, setMedia] = useState([]);

  const canComment = useRef(false);
  const canInterest = useRef(false);

  // const handleShowAllComments = () => {
  //      setShowAllComments(true);
  // };

  const toggleShowAllComments = () => {
    setShowAllComments(!showAllComments);
    setShowLimitedComments(!showLimitedComments); // Prebacujemo prikaz na ograničeni ako je bio prikazan cijeli, i obrnuto
  };

  const { user, updateUser, logout, loading } = useUser();

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

  const getEventMedia = async () => {
    const accessToken = localStorage.getItem("jwt");
    dc.GetData(API_URL + "/api/getEventMedia/" + props.event.id, accessToken)
      .then((resp) => {
        if (resp.data && resp.data.success === true) {
          setMedia(resp.data.data);
        } else {
          openSnackbar("error", "Failed to fetch media.");
        }
      })
      .catch((e) => openSnackbar("error", "Failed to fetch media."));
  };

  useEffect(() => {
    fetchData();
    getEventMedia();
  }, [props]);

  useEffect(() => {
    if (
      user &&
      user !== null &&
      user.roleId === 0 &&
      cards &&
      cards !== null &&
      cards.time &&
      cards.time !== null
    ) {
      const parsedEventDate = new Date(cards.time);
      const currentDate = new Date();
      parsedEventDate.setHours(parsedEventDate.getHours() - 1);
      const timeDifference = parsedEventDate - currentDate;

      if (timeDifference < 0 && timeDifference > -48 * 60 * 60 * 1000) {
        canComment.current = true;
      }

      if (timeDifference >= 0) {
        canInterest.current = true;
      }
    }
  }, [cards]);

  const { openSnackbar } = useSnackbar();

  const handlePickInterest = async (interest) => {
    if (props && props.event) {
      const accessToken = localStorage.getItem("jwt");
      dc.PostData(
        API_URL + "/setInterest/" + props.event.id,
        {
          interest: interest,
        },
        accessToken
      )
        .then((resp) => {
          // console.log("THIS:", resp.data);
          if (resp.data.success === true) {
            openSnackbar("success", "Interest posted successfully!");
            props.closeDialog();
          }
        })
        .catch((e) => {
          openSnackbar("error", "Unknown Error");
          console.log(e);
        });
    }
  };

  const handleSubmit = (event) => {
    if (props && props.event) {
      const accessToken = localStorage.getItem("jwt");

      event.preventDefault();
      const data = new FormData(event.currentTarget);

      if (data.get("comment").length < 5 || data.get("comment").length > 200) {
        openSnackbar(
          "error",
          "Comment must be between 5 and 200 characters long!"
        );
        return;
      }

      const newComment = {
        comment: data.get("comment"),
      };

      dc.PostData(
        API_URL + "/createComment/" + props.event.id,
        newComment,
        accessToken
      )
        .then((resp) => {
          if (resp.success === true && resp.data.success === true) {
            openSnackbar("success", "Comment posted successfully!");
            props.closeDialog();
          } else {
            openSnackbar("error", "Error creating Comment");
          }
        })
        .catch((resp) => {
          openSnackbar("error", "Error creating Comment");
        });
    }
  };

  const { theme, toggleTheme } = useTheme();

  return (
    <Box sx={{ overflowY: "auto", maxHeight: "90vh", width: "70vw" }}>
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
                overflowY: "hidden",
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
              <Typography
                variant="h5"
                color={theme.palette.text.main}
                ml={1}
                mt={1}
              >
                {cards.time.slice(0, 10) + ", " + cards.time.slice(11, 16)}
              </Typography>
              <Divider sx={{ bgcolor: theme.palette.text.light }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between" }}
                mb={1}
              >
                <div>
                  <Typography
                    variant="body1"
                    color={theme.palette.primary.light}
                    ml={1}
                    mt={1}
                  >
                    {cards.location + ", " + cards.city}
                  </Typography>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.light}
                    ml={1}
                  >
                    {cards.eventType}
                  </Typography>
                </div>
                <div>
                  <Box
                    mr={1}
                    mt={1}
                    style={{
                      display: "flex",
                      gap: "1rem",
                    }}
                  >
                    <Chip
                      sx={{ bgcolor: "#53e848" }}
                      label={"Coming: " + cards.interested}
                    />
                    <Chip
                      sx={{ bgcolor: "#fff875" }}
                      label={"Intersted: " + cards.maybe}
                    />
                    <Chip
                      sx={{ bgcolor: "#fc727f" }}
                      label={"Not coming: " + cards.nointerest}
                    />
                  </Box>

                  {user &&
                  user !== null &&
                  user.roleId === 0 &&
                  canInterest.current === true ? (
                    <Box ml={0}>
                      <Button size="small" ml={1} mr={1}>
                        <Typography
                          onClick={() => {
                            handlePickInterest(1);
                          }}
                          variant="body1"
                          color={theme.palette.primary.main}
                          style={{ textTransform: "none" }}
                        >
                          I'm coming
                        </Typography>
                      </Button>
                      <Button size="small" ml={1} mr={1}>
                        <Typography
                          onClick={() => {
                            handlePickInterest(0);
                          }}
                          variant="body1"
                          color={theme.palette.primary.main}
                          style={{ textTransform: "none" }}
                        >
                          I'm interested
                        </Typography>
                      </Button>
                      <Button size="small" ml={1} mr={1}>
                        <Typography
                          onClick={() => {
                            handlePickInterest(-1);
                          }}
                          variant="body1"
                          color={theme.palette.primary.main}
                          style={{ textTransform: "none" }}
                        >
                          I'm not coming
                        </Typography>
                      </Button>
                    </Box>
                  ) : null}
                </div>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  marginBottom: 1,
                  marginTop: 1,
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
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "right",
                }}
                color={theme.palette.text.main}
              >
                {cards.description}
              </Typography>

              <ImageList
                sx={{ width: "60rem", height: "20rem" }}
                cols={3}
                rowHeight={"20rem"}
              >
                {media.map((item) => (
                  <ImageListItem key={item.mediaId}>
                    <img src={item.mediaSource} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
              <Divider sx={{ bgcolor: theme.palette.text.light }} />
              <Typography
                variant="h6"
                sx={{ marginTop: 3 }}
                color={theme.palette.text.main}
              >
                {"Comments: "}
              </Typography>
              {reviews && reviews !== null && reviews.length === 0 ? (
                <Typography
                  variant="body1"
                  sx={{ marginTop: 1 }}
                  color={theme.palette.text.main}
                >
                  {"No Comments for this Event"}
                </Typography>
              ) : null}
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
              {user &&
              user !== null &&
              user.roleId === 0 &&
              canComment.current === true ? (
                <Grid
                  container
                  spacing={2}
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    display: "flex",
                    position: "right",
                    justifyContent: "right",
                    marginTop: 3,
                  }}
                >
                  <TextField
                    inputProps={{
                      pattern: ".{1,200}",
                      title: "Must be under 200 characters long",
                    }}
                    fullWidth
                    label="Your Comment"
                    name="comment"
                    InputProps={{
                      style: { color: theme.palette.text.main },
                    }}
                    InputLabelProps={{
                      style: { color: theme.palette.text.light },
                    }}
                    sx={{ marginLeft: 2, marginRight: 2 }}
                  />
                  <Button
                    type="submit"
                    sx={{
                      color: theme.palette.primary.main,
                      marginTop: 1,
                      marginRight: 2,
                    }}
                    variant="outlined"
                  >
                    Post Your Comment
                  </Button>
                </Grid>
              ) : null}
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
