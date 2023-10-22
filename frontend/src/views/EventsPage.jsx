import React, { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EventIcon from '@mui/icons-material/Event';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import TableRowsIcon from '@mui/icons-material/TableRows';
import LoginIcon from '@mui/icons-material/Login';
import { green, grey, orange } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Divider, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function EventsPage() {
  const [cards, setCards] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:5000/getThing", { method: "GET" });
      if (resp.ok) {
        const respJson = await resp.json();
        setCards(respJson);
      }
    } catch {
      console.error("Bad!");
    }
  };

  function handleTabChange(event, newValue) {
    setCurrentTab(newValue);
  }

  function toggleDrawer() {
    setDrawerOpen((prevState) => !prevState);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: green[600],
      },
      secondary: {
        main: grey[500],
        other: grey[200]
      }
    },
    background: {
      default: grey[100]
    }
  });

  return (
    <Paper sx={{bgcolor:defaultTheme.palette.secondary.other}}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar sx={{display:"flex", justifyContent:"space-between"}}>
            <Button onClick={toggleDrawer}>
              <TableRowsIcon sx={{color: defaultTheme.palette.secondary.other}} />
            </Button>

            <Typography variant="h5" color={defaultTheme.palette.secondary.other} noWrap>
              Events
            </Typography>

            <Button onClick={() => {navigate('/login')}} >
              <LoginIcon sx={{color: defaultTheme.palette.secondary.other}} />
            </Button>
          </Toolbar>
        </AppBar>
        <>

          {drawerOpen ? 
            <Drawer
              open={drawerOpen}
              onClose={toggleDrawer}
            >
              <Typography variant="h5" sx={{textAlign:"center", mt:2, mb:2}}>ConnectiNET</Typography>
              <Box
                sx={{ width: 350 }}
                // nClick={toggleDrawer}
                // onKeyDown={toggleDrawer}
              >
                <div />
                <Divider />
                <List>
                  {['Profile', 'Events', 'My Events'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          {index === 1 ? <EventIcon /> :
                            index === 0 ? <AccountCircleIcon /> :
                              <EditCalendarIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>   
          : null}

          {/* Hero unit */}
          <Container sx={{ py: 4 }} maxWidth="md">

            <Tabs variant="fullWidth" value={currentTab} onChange={handleTabChange} sx={{bgcolor: defaultTheme.palette.secondary.other}}>
              <Tab label="Top Picks" />
              <Tab label="New" />
              <Tab label="Near You" />
            </Tabs>  
            
            <div>
              <br></br>
            </div>

            {currentTab === 0 ?
              <Grid container spacing={4}>
              {cards && cards !== null ? cards.map((card) => (
                <Grid item key={card} xs={12} sm={6} md={12}>
                  <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    elevation={24}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        // 16:9
                        pt: '56.25%',
                      }}
                      image={card.image}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
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
                </Grid>
              )) : <Box sx={{ bgcolor: defaultTheme.palette.secondary.other, height: "1000px" }} component="footer" />}
            </Grid>
            : null}

            {currentTab === 1 ?
              <Grid container spacing={4}>
              {cards && cards !== null ? cards.slice().sort((a, b) => {return b.priority - a.priority}).map((card) => (
                <Grid item key={card} xs={12} sm={6} md={12}>
                  <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    elevation={24}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        // 16:9
                        pt: '56.25%',
                      }}
                      image={card.image}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
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
                </Grid>
              )) : null}
            </Grid>
            : null}

            {currentTab === 2 ?
              <Grid container spacing={4}>
              {cards && cards !== null ? cards.slice().sort((a, b) => {return b.time - a.time}).map((card) => (
                <Grid item key={card} xs={12} sm={6} md={12}>
                  <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    elevation={24}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        // 16:9
                        pt: '56.25%',
                      }}
                      image={card.image}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
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
                </Grid>
              )) : null}
            </Grid>
            : null}
            
          </Container>
        </>
        
        {/* Footer */}
        <Box sx={{ bgcolor: defaultTheme.palette.primary.main, p: 4.5 }} component="footer">
          <Typography variant="h6" align="center" gutterBottom color={defaultTheme.palette.secondary.other}>
            ConnectiNET
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color={defaultTheme.palette.secondary.other}
          >
            by Kraljevi
          </Typography>
        </Box>
        {/* End footer */}
      </ThemeProvider>
    </Paper>
  );
}
