import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from "../context/ThemeContext";

export default function EventCard(props) { 
    const { card } = props;
    const { theme, toggleTheme } = useTheme();

    return (
        <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.default, color: theme.palette.text }}
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
                <Typography gutterBottom variant="h5" component="h2" color={theme.palette.text.main}>
                    {card.title}
                </Typography>
                <Typography color={theme.palette.text.light}>
                    {card.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">
                    <Typography variant="body1" color={theme.palette.primary.main} style={{ textTransform: 'none' }}>See More</Typography>
                </Button>
            </CardActions>
        </Card>
    )
}