import { useLocation } from 'react-router-dom';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';



export default function EventDetail(props) {

    const {state} = useLocation();
    const navigate = useNavigate();

  return (
    <div> 
       
       <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            elevation={24}
            onMouseEnter={() => {/*console.log("Mouse enter")*/}}
        >
            <CardMedia
                component="div"
                sx={{
                    // 16:9
                    pt: state.event.image ? '26.25%' : '2.5%',
                }}
                image={state.event.image ? state.event.image : <div />}
                key={state.event.id}
            />
            <CardContent sx={{ flexGrow: 1 }} key={state.event.id}>
                <Typography gutterBottom variant="h5" component="h2">
                    {state.event.title}
                </Typography>
                <Typography>
                    {state.event.description}
                </Typography>
                <Typography>
                    {state.event.accountId}
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={() => navigate("/events")} size="small">Back</Button>
            </CardActions>
        </Card>


       

    </div>
    
  )
}
