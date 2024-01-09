import { useLocation } from 'react-router-dom';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import React, { useEffect, useState } from "react";
import dataController from "../utils/DataController";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import EventCard from "../ui/EventCard";
import Container from '@mui/material/Container';
import UserUploadedImage from "../ui/UserUploadedImage";
import { Link } from 'react-router-dom';








export default function EventDetail(props) {

    const MAX_COMMENT_LENGTH = 150;

    const API_URL = process.env.REACT_APP_API_URL;

    const {state} = useLocation();
    const navigate = useNavigate();
    const [cards, setCards] = useState(null);
    const [comments, setComments] = useState(null);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showLimitedComments, setShowLimitedComments] = useState(true);
  


    // const handleShowAllComments = () => {
    //      setShowAllComments(true);
    // };

    const toggleShowAllComments = () => {
        setShowAllComments(!showAllComments);
        setShowLimitedComments(!showLimitedComments); // Prebacujemo prikaz na ograničeni ako je bio prikazan cijeli, i obrnuto
      };

    const allComments = comments ? comments.map((comment) => (
        <li>{comment.length > MAX_COMMENT_LENGTH
            ? `${comment.slice(0, MAX_COMMENT_LENGTH)}...`
            : comment}
        </li>
    ))  : null
    
    let limitedComments = null;
    if (Array.isArray(comments)) {
        limitedComments = comments.slice(0, 3).map((comment, index) => (
        <li key={index}>
            {comment.length > MAX_COMMENT_LENGTH
            ? `${comment.slice(0, MAX_COMMENT_LENGTH)}...`
            : comment}
        </li>
        ));
    }

    
    const dc = new dataController();

    const fetchData = async () => {
        const accessToken = localStorage.getItem("jwt");
        dc.GetData(API_URL + "/getEvent/" + state.event.id, accessToken).then((resp) => {
          // console.log("THIS:", resp.data);
          if (resp.data.success === true) {
            // console.log("Cards set to :", resp.data.data);
            setCards(resp.data.data);
            setComments(resp.data.comments)

          }
        });
      };

    useEffect(() => {
    const accessToken = localStorage.getItem("jwt");
    if (accessToken === null) {
        navigate("/login");
    } else {
        fetchData();
    }
    }, []);

    

  return (
    <div> 
       {cards && cards.id != null ? (
        <Container maxWidth="lg">

            <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                elevation={24}
                onMouseEnter={() => {/*console.log("Mouse enter")*/}}
                >
                <CardMedia
                    component="div"
                    key={cards.id}
                />
                <CardContent sx={{ flexGrow: 1 }} key={state.event.id}>
                    <UserUploadedImage src = {"/"+cards.image_org}>
                    </UserUploadedImage>
                    <Typography gutterBottom variant="h2" component="h2">
                        {cards.title}
                    </Typography>
                    <br></br>
                    <Typography variant="h5">
                        {cards.description}
                    </Typography>
                    <br></br>
                    <Typography>
                        {"Organizator: " + cards.organizer}
                        <Link to={"/organizer/" + cards.accountId}>
                            <UserUploadedImage src = {"/"+cards.image_org} 
                                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                            > </UserUploadedImage>
                        </Link>
                    </Typography>
                    <br></br>
                    <Typography>  
                        {"Komentari: "}
                        {showAllComments ? allComments : limitedComments}
                        {/* {!showAllComments && comments.length > 3 && (
                            <button onClick={handleShowAllComments}>Show all</button>
                        )} */}
                        {showLimitedComments && comments.length > 3 && (
                            <button onClick={toggleShowAllComments}>Prikaži sve komentare</button>
                        )}
                        {showAllComments && (
                            <button onClick={toggleShowAllComments}>Sakrij komentare</button>
                        )}
                    </Typography>
                    <br></br>
                    <Typography>
                        {"Interested:" + cards.interest + "| Maybe:" + cards.maybe + "| Not interested:" + cards.nointerest}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={() => navigate("/events")} size="small">Back</Button>
                </CardActions>
            </Card> 


        </Container>   
        
        ):  null}

        

    </div>
    
    
  )
}
