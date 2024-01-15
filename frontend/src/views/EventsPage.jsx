import React, { useEffect, useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { green, grey, indigo } from "@mui/material/colors";
import { Menu, MenuItem, Paper, Typography } from "@mui/material";
import EventCard from "../ui/EventCard";
import dataController from "../utils/DataController";

import { useUser } from "../context/UserContext";

import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";

import { Dropdown } from '@mui/base/Dropdown';
import { styled } from '@mui/system';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useTheme } from "../context/ThemeContext";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import { useSnackbar } from "../context/SnackbarContext";


export default function EventsPage(props) {
  const API_URL = process.env.REACT_APP_API_URL;

  const [cards, setCards] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [cards_help, setCards_help] = useState(null);
  const [length, setLenght] = useState(null);

  const [anchorElType, setAnchorElType] = useState(null);
  const [anchorElTime, setAnchorElTime] = useState(null);
  const [anchorElPrice, setAnchorElPrice] = useState(null);

  //const [sort, setSort] = useState(1);

  const { user, updateUser, logout, loading } = useUser();
  
  const { openSnackbar } = useSnackbar();

  const dc = new dataController();
  const numOfEventsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const accessToken = localStorage.getItem("jwt");
    dc.GetData(API_URL + "/getEvents", accessToken).then((resp) => {
      // console.log("THIS:", resp.data);
      if (resp.data.success === true) {
        // console.log("Cards set to :", resp.data.data);
        setCards(resp.data.data);
        setCards_help(resp.data.data);
        setLenght(Math.ceil(resp.data.data.length / numOfEventsPerPage))

      }
    }).catch((e) => {
      console.log(e);
      openSnackbar('error', 'Error fetching Event Data')
    });
  };

  function handleTabChange(event, newValue) {
    setCurrentTab(newValue);
  }

  const Listbox = styled('ul')(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 6px;
    margin: 12px 0;
    min-width: 200px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    box-shadow: 0px 4px 6px ${
      theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'
    };
    z-index: 1;
    `,
  );
  
  const paginationStyle = {
    fontSize: '1.5rem', // Povećajte veličinu fonta
  };

  const { theme, toggleTheme } = useTheme();
  
  function sortCards(value) {
    let fakeCard = cards;

    if (value == 1) {
      fakeCard = cards.slice().sort((a, b) => {
              return b.time - a.time;
            })
    } else if (value == 2) {
      fakeCard = cards.slice().sort((a, b) => {
        return b.price - a.price;
      })
    } else if (value == 3) {
      fakeCard = cards.slice().sort((a, b) => {
        return a.price - b.price;
      })
    } else if (value == 4) {
      fakeCard = cards.slice().sort((a, b) => {
        return b.interest - a.interest;
      })
    }    
    setCards(fakeCard)

  }

  const [lowerPrice, setLowerPrice] = useState(0);
  const [upperPrice, setUpperPrice] = useState(100);

  const handleChange = (event, newValue) => {
    setLowerPrice(newValue[0]);
    setUpperPrice(newValue[1]);
  };

  
  const handleFilter = () => {
    const oneDay = 24 * 60 * 60 * 1000; // 24 sata
    const sevenDays = 7 * oneDay;
    //najmerno stavljeno 6 mjeseci radi testiranja
    const oneMonth = 6 * 30 * oneDay; 

    const currentTime = new Date();

    

    const filteredCards = cards_help.filter((card) => {
      const cardPrice = card.price; // Pretpostavljeno ime atributa cijene u objektu kartice
      return cardPrice >= lowerPrice && cardPrice <= upperPrice;
    });

    const filteredCards_time = filteredCards.filter((card) => {
      const cardTime = new Date(card.time); // Pretpostavljeno ime atributa cijene u objektu kartice
      const difference = currentTime - cardTime;
      switch (selectedValue) {
        case "today":
          return difference <= oneDay;
        case "week":
          return difference <= sevenDays;
        case "month":
          return difference <= oneMonth;
        default:
          return true;
      }     
    });

    if (Array.isArray(filteredCards_time)) {
      const sizeOfCards = Math.ceil(filteredCards_time.length / numOfEventsPerPage);
      setLenght(sizeOfCards)
    } 
    // Ovdje koristite filtrirane kartice kako god želite
    setCards(filteredCards_time)
  };

  const [selectedValue, setSelectedValue] = useState('');

  const handleChange_time = (event) => {
    setSelectedValue(event.target.value);
    // Ovdje možete dodati logiku ili akcije na promjenu odabrane vrijednosti
  };

  const clearFilter = () => {
    setCards(cards_help)
    setLowerPrice(0);
    setUpperPrice(40);
  }

  const [currentPage, setCurrentPage] = useState(1); // Postavljanje trenutne stranice na 1, kao primjer

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber); 
  };

  return (
    <ProtectedComponent roles={[0, 1, -1]}>
      <Paper sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh", }}>
        <CssBaseline />
        <MainHeader for="Events"></MainHeader>
        <>
          {/* Hero unit */}
          <Container sx={{ py: 4 }} maxWidth="lg">
            <Tabs
              variant="fullWidth"
              value={currentTab}
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: {
                  backgroundColor: theme.palette.primary.main
                }
              }}
              textColor="inherit"
            >
              <Tab
                label="Popular"
                sx={{ color: theme.palette.text.main }}
              />
              <Tab label="New" sx={{ color: theme.palette.text.main }} />
              <Tab
                label="Free"
                sx={{ color: theme.palette.text.main }}
              />
            </Tabs>

            <div>
            <br></br>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Box>
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button onClick={(event) => {setAnchorElType(event.currentTarget);}} sx={{color: theme.palette.primary.main}}>Type</Button>
                    <Menu open={Boolean(anchorElType)} anchorEl={anchorElType} onClose={() => {setAnchorElType(null)}}>
                      <MenuItem onClick={() => {}}>
                        <Typography>Type 1</Typography>
                      </MenuItem>
                      <MenuItem onClick={() => {}}>
                        <Typography>Type 2</Typography>
                      </MenuItem>
                      <MenuItem onClick={() => {}}>
                        <Typography>Type 3</Typography>
                      </MenuItem>
                    </Menu>

                    <Button onClick={(event) => {setAnchorElPrice(event.currentTarget);}} sx={{color: theme.palette.primary.main}}>Price</Button>
                    <Menu open={Boolean(anchorElPrice)} anchorEl={anchorElPrice} onClose={() => {setAnchorElPrice(null)}}>
                      <MenuItem>
                        <Slider
                          value={[lowerPrice, upperPrice]}
                          onChange={handleChange}
                          min={0}
                          max={40}
                          valueLabelDisplay="auto"
                          aria-labelledby="range-slider"
                          sx={{ width: 200 }} 
                        />
                      </MenuItem>
                    </Menu>
                    
                    <Button onClick={(event) => {setAnchorElTime(event.currentTarget);}} sx={{color: theme.palette.primary.main}}>Time</Button>
                    <Menu open={Boolean(anchorElTime)} anchorEl={anchorElTime} onClose={() => {setAnchorElTime(null)}}>
                      <FormControl component="fieldset">
                        <RadioGroup
                          aria-label="gender"
                          name="gender"
                          value={selectedValue}
                          onChange={handleChange_time}
                        >
                          <FormControlLabel value="today" control={<Radio />} label="Today" />
                          <FormControlLabel value="week" control={<Radio />} label="This week" />
                          <FormControlLabel value="month" control={<Radio />} label="This month" />
                        </RadioGroup>
                      </FormControl>
                    </Menu>
                  </div>

                  <Box sx={{display: 'flex', position: 'center'}}>
                    <Button variant="outlined" onClick={handleFilter} sx={{mr: 1, color: theme.palette.primary.main}}>
                      Apply Filter 
                    </Button>
                    <Button variant="outlined" onClick={clearFilter} sx={{color: theme.palette.primary.main}}>
                      Clear filter
                    </Button>
                  </Box>
                </Box> 
            </div>
            
            </div>
            
            <br></br>
            <br></br>
            </div>

            {currentTab === 0 ? (
              <Grid container spacing={4}>
                {cards && cards !== null ? (
                cards.slice((currentPage - 1) * numOfEventsPerPage, currentPage * numOfEventsPerPage).map((card) => (
                  <Grid item key={card.id} xs={12} sm={6} md={6}>
                    <EventCard card={card} />
                  </Grid>
                ))
              ) : (
                <Box
                  sx={{
                    bgcolor: theme.palette.secondary.other,
                    height: "1000px",
                  }}
                  component="footer"
                />
              )} 
                  {/* cards.map((card) => (
                    <Grid item key={card.id} xs={12} sm={6} md={6}>
                      <EventCard card={card} />
                    </Grid>
                  ))
                ) : (
                  <Box
                    sx={{
                      bgcolor: theme.palette.secondary.light,
                      height: "1000px",
                    }}
                    component="footer"
                  />
                )} */}
              </Grid>
            ) : null}

            {currentTab === 1 ? (
              <Grid container spacing={4}>
                {cards && cards !== null
                  ? cards
                      .slice((currentPage - 1) * 4, currentPage * 4)
                      .map((card) => (
                        <Grid item key={card} xs={12} sm={6} md={6}>
                          <EventCard card={card} />
                        </Grid>
                      ))
                  : null}
              </Grid>
            ) : null}

            {currentTab === 2 ? (
              <Grid container spacing={4}>
                {cards && cards !== null
                  ? cards.sort((a, b) => {return a.interest - b.interest})
                      .slice((currentPage - 1) * 4, currentPage * 4).map((card) => (
                        <Grid item key={card} xs={12} sm={6} md={6}>
                          <EventCard card={card} />
                        </Grid>
                      ))
                  : null}
              </Grid>
            ) : null}
            <br></br>

            <Stack spacing={2} /*sx={centerStyle}*/>
              <Pagination count={length} sx={paginationStyle} page={currentPage} onChange={handlePageChange}/>
            </Stack>
          </Container>
        </>
        
        {/* Footer */}
        {/* End footer */}
      </Paper>
      <MainFooter></MainFooter>
    </ProtectedComponent>
  );

  
}
