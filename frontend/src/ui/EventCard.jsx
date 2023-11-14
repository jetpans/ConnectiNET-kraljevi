import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function EventCard(props) { 
    const { card } = props;

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
                image={card.image ? card.image : <div />}
                key={card.id}
            />
            <CardContent sx={{ flexGrow: 1 }} key={card.id}>
                <Typography gutterBottom variant="h5" component="h2">
                    {card.title}
                </Typography>
                <Typography>
                    {card.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">View</Button>
                <Button size="small">Edit</Button>
            </CardActions>
        </Card>
    )
}