import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { browserHistory } from 'react-router';
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserUploadedImage from "./UserUploadedImage";


export default function EventCard(props) { 
    const { card } = props;
    const navigate = useNavigate();
    const maxDescriptionLength = 150;

    function displayEvent() {   
        navigate("/event", {state: {event: card}});
        console.log("Going to view", card)
        
    }
    return (
        <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            elevation={24}
            onMouseEnter={() => {/*console.log("Mouse enter")*/}}
        >
            <CardMedia
                component="div"
                sx={{
                    // 16:9
                    pt: card.image ? '26.25%' : '2.5%',
                }}
                // image={card.image ? card.image : <div />}
                key={card.id}
            >
                <UserUploadedImage src = "/placeholder.jpg">

                </UserUploadedImage>
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }} key={card.id}>
                <Typography gutterBottom variant="h5" component="h2">
                    {card.title}
                </Typography>
                <Typography>
                    {card.description.length > maxDescriptionLength
                    ? `${card.description.slice(0, maxDescriptionLength)}...`
                    : card.description}
                </Typography>
                
                <Typography >
                    {"Organizator: " + card.organizer}
                </Typography>
                <Typography >
                    {"Vrijeme: " + card.time.slice(0, 10)}
                </Typography>  
                <Typography >
                    {"Cijena: " + card.price}
                </Typography> 
                <Typography >
                    {"Interest: " + card.interest}
                </Typography> 
                
            </CardContent>
            <CardActions>
                <Button onClick={displayEvent} size="small">View</Button>
            </CardActions>
        </Card>
    )
}