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
import { useTheme } from "../context/ThemeContext";
import { useDialog } from "../context/DialogContext";
import EventDetail from "../views/EventDetail";
import UserUploadedEventImage from "./UserUploadedEventImage";


export default function EventCard(props) { 
    const { card } = props;
    const { theme, toggleTheme } = useTheme();
    const maxDescriptionLength = 150;
    const { openDialog, closeDialog } = useDialog();
    const navigate = useNavigate();

    const handleCloseAndReroute = (path) => {
        closeDialog();
        navigate(path);
    }

    function displayEvent() {
        openDialog(<EventDetail event={card} closeDialog={closeDialog} closeDialogExtended={(path) => {handleCloseAndReroute(path)}} />);
        // navigate("/event", {state: {event: card}});        
    }

    return (
        <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.default, color: theme.palette.text, marginTop: '0px' }}
            elevation={24}
            onMouseEnter={() => {/*console.log("Mouse enter")*/}}
        >
            <CardMedia
                component="div"
                sx={{
                    // 16:9
                    pt: '2.5%',
                    marginTop: 0,
                    padding: 0
                }}
                // image={card.image ? card.image : <div />}
                key={card.id}
            >
                <UserUploadedEventImage src="/placeholder.jpg" notProfileImage={true} />
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }} key={card.id}>
                <Typography gutterBottom variant="h5" component="h2" color={theme.palette.text.main}>
                    {card.title}
                </Typography>
                <Typography color={theme.palette.text.light}>
                    {card.description.length > maxDescriptionLength
                    ? `${card.description.slice(0, maxDescriptionLength)}...`
                    : card.description}
                </Typography>
                
                <Typography color={theme.palette.text.light}>
                    {"Organizator: " + card.organizer}
                </Typography>
                <Typography color={theme.palette.text.light}>
                    {"Vrijeme: " + card.time.slice(0, 10)}
                </Typography>  
                <Typography color={theme.palette.text.light}>
                    {"Cijena: " + card.price}
                </Typography> 
                {/* <Typography >
                    {"Interest: " + card.interest}
                </Typography>  */}
                
            </CardContent>
            <CardActions>
                <Button size="small">
                    <Typography onClick={displayEvent} variant="body1" color={theme.palette.primary.main} style={{ textTransform: 'none' }}>See More</Typography>
                </Button>
            </CardActions>
        </Card>
    )
}