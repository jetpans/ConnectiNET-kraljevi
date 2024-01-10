import React, { useEffect, useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { green, grey, indigo } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Divider, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EventCard from "../ui/EventCard";
import dataController from "../utils/DataController";

import { useUser } from "../context/UserContext";

import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";

import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { styled } from '@mui/system';

import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';




export default function EventsPage(props) {
  const API_URL = process.env.REACT_APP_API_URL;

  const [cards, setCards] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [cardSize, setCardSize] = useState(12);
  const navigate = useNavigate();
  const [cards_help, setCards_help] = useState(null);
  const [length, setLenght] = useState(null);

  //const [sort, setSort] = useState(1);


  const { user, updateUser, logout, loading } = useUser();

  const dc = new dataController();
  const numOfEventsPerPage = 2;

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
    });
  };

  function handleTabChange(event, newValue) {
    setCurrentTab(newValue);
  }

  

  useEffect(() => {
    const accessToken = localStorage.getItem("jwt");
    if (accessToken === null) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, []);

  

  const lightTheme = createTheme({
    palette: {
      primary: {
        main: indigo[400],
      },
      secondary: {
        main: grey[500],
        other: grey[200],
      },
    },
    background: {
      default: grey[100],
    },
  });
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: indigo[300],
      },
      secondary: {
        main: grey[500],
        other: grey[200],
      },
      text: {
        main: grey[900],
      },
    },
    background: {
      default: grey[900],
    },
  });
  const blue = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#99CCF3',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E6',
    700: '#0059B3',
    800: '#004C99',
    900: '#003A75',
  };
  
  
  
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
  
  const MenuItem = styled(BaseMenuItem)(
    ({ theme }) => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: default;
    user-select: none;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${menuItemClasses.focusVisible} {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    }
  
    &.${menuItemClasses.disabled} {
      color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
    }
  
    &:hover:not(.${menuItemClasses.disabled}) {
      background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[50]};
      color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
    }
    `,
  );
  
  const MenuButton = styled(BaseMenuButton)(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }
  
    &:active {
      background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
      outline: none;
    }
    `,
  );
  const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '20px', // Dodajte željeni razmak iznad Pagination komponente
  };
  
  const paginationStyle = {
    fontSize: '1.5rem', // Povećajte veličinu fonta
  };

  const mainTheme = lightTheme;

  
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
    <Paper sx={{ bgcolor: mainTheme.background.default }}>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <MainHeader for="Events"></MainHeader>
        <>
          {/* Hero unit */}
          <Container sx={{ py: 4 }} maxWidth="lg">
            <Tabs
              variant="fullWidth"
              value={currentTab}
              onChange={handleTabChange}
            >
              <Tab
                label="Top Picks"
                sx={{ color: mainTheme.palette.text.main }}
              />
              <Tab label="New" sx={{ color: mainTheme.palette.text.main }} />
              <Tab
                label="Near You"
                sx={{ color: mainTheme.palette.text.main }}
              />
            </Tabs>

            <div>
            <br></br>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Dropdown>
                  <MenuButton>Sort by</MenuButton>
                  <Menu slots={{ listbox: Listbox }}>
                    <MenuItem onClick={() => sortCards(1)}>Newest</MenuItem>
                    <MenuItem onClick={() => sortCards(2)}>
                      High price
                    </MenuItem>
                    <MenuItem onClick={() => sortCards(3)}>
                      Low price
                    </MenuItem>
                    <MenuItem onClick={() => sortCards(4)}>Most Interest</MenuItem>
                  </Menu>
                </Dropdown> 
              
                <Dropdown>
                  <MenuButton>Price</MenuButton>
                  <Menu slots={{ listbox: Listbox }}>
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
                </Dropdown>
              
              <Dropdown>
                <MenuButton>Time</MenuButton>
                <Menu slots={{ listbox: Listbox }}>
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
              </Dropdown>
            </div>
              <div><Button variant="contained" onClick={handleFilter}>
                Filter
              </Button>
              
              <Button variant="contained" onClick={clearFilter}>
                Clear filter
              </Button></div>
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
                    bgcolor: mainTheme.palette.secondary.other,
                    height: "1000px",
                  }}
                  component="footer"
                />
              )} 
              </Grid>
            ) : null}

            {currentTab === 1 ? (
              <Grid container spacing={4}>
                {cards && cards !== null
                  ? cards
                      .slice( (currentPage - 1) * 4, currentPage * 4)
                      .map((card) => (
                        <Grid item key={card} xs={12} sm={6} md={12}>
                          <EventCard card={card} />
                        </Grid>
                      ))
                  : null}
              </Grid>
            ) : null}

            {currentTab === 2 ? (
              <Grid container spacing={4}>
                {cards && cards !== null
                  ? cards
                      .slice().map((card) => (
                        <Grid item key={card} xs={12} sm={6} md={12}>
                          <EventCard card={card} />
                        </Grid>
                      ))
                  : null}
              </Grid>
            ) : null}
            <br></br>

            <Stack spacing={2} sx={centerStyle}>
              <Pagination count={length} sx={paginationStyle} page={currentPage} onChange={handlePageChange}/>
            </Stack>;
          </Container>
        </>
        
        {/* Footer */}
        <MainFooter></MainFooter>
        {/* End footer */}
      </ThemeProvider>
    </Paper>
  );

  
}
