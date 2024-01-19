import React, { useEffect, useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { green, grey, indigo } from "@mui/material/colors";
import { Menu, MenuItem, Paper, Select, Typography } from "@mui/material";
import EventCard from "../ui/EventCard";
import dataController from "../utils/DataController";

import { useUser } from "../context/UserContext";

import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";

import { Dropdown } from "@mui/base/Dropdown";
import { styled } from "@mui/system";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useTheme } from "../context/ThemeContext";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import { useSnackbar } from "../context/SnackbarContext";
import { useNotification } from "../context/NotificationContext";

export default function EventsPage(props) {
  const API_URL = process.env.REACT_APP_API_URL;

  const [cards, setCards] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [cards_help, setCards_help] = useState(null);
  const [length, setLength] = useState(null);

  const [anchorElType, setAnchorElType] = useState(null);
  const [anchorElTime, setAnchorElTime] = useState(null);
  const [anchorElPrice, setAnchorElPrice] = useState(null);
  const [anchorElCountry, setAnchorElCountry] = useState(null);

  const [selectedTimeValue, setSelectedTimeValue] = useState("");
  const [selectedPriceValue, setSelectedPriceValue] = useState("");
  const [selectedCountryValue, setSelectedCountryValue] = useState("");
  const [selectedTypeValue, setSelectedTypeValue] = useState("");

  const [countries, setCountries] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  const [stupidClearState, setStupidClearState] = useState(0);

  //const [sort, setSort] = useState(1);

  const { user, updateUser, logout, loading } = useUser();
  const {
    notifications,
    addNotifications,
    setNewNotification,
    clearNotifications,
  } = useNotification();

  const { openSnackbar } = useSnackbar();

  const dc = new dataController();
  const numOfEventsPerPage = 10;

  useEffect(() => {
    fetchData();
    fetchCountries();
    fetchEventTypes();
  }, []);

  useEffect(() => {
    if (
      user !== null &&
      cards_help !== null &&
      user !== undefined &&
      cards_help !== undefined
    ) {
      fetchNotificationOptions();
    }
  }, [user, cards_help]);

  const fetchNotificationOptions = async () => {
    const accessToken = localStorage.getItem("jwt");
    dc.GetData(API_URL + "/api/getNotificationOptions", accessToken)
      .then((resp) => {
        if (resp.success === true) {
          let createdNotifications = [];
          let eventsToSearch = cards_help.filter((event) => {
            if (
              checkEventTime(new Date(event.time)) === "in the next week" ||
              checkEventTime(new Date(event.time)) === "is today"
            ) {
              return true;
            } else {
              return false;
            }
          });

          if (
            resp.data.data.countryCodes !== null &&
            resp.data.data.countryCodes !== undefined &&
            resp.data.data.countryCodes.length > 0
          ) {
            for (const event of eventsToSearch) {
              if (resp.data.data.countryCodes.includes(event.country)) {
                createdNotifications.push(event);
              }
            }
          }
          if (
            resp.data.data.eventTypesCodes !== null &&
            resp.data.data.eventTypesCodes !== undefined &&
            resp.data.data.eventTypesCodes.length > 0
          ) {
            for (const event of eventsToSearch) {
              if (
                resp.data.data.eventTypesCodes.includes(event.type) &&
                !createdNotifications.includes(event)
              ) {
                createdNotifications.push(event);
              }
            }
          }

          if (createdNotifications.length === 0) {
            clearNotifications();
          }

          let tester = true;
          const existingNotifications = JSON.parse(
            localStorage.getItem("notifications")
          );
          if (
            existingNotifications !== null &&
            existingNotifications !== undefined
          ) {
            for (const event of createdNotifications) {
              if (!existingNotifications.includes(event)) {
                tester = false;
              }
            }
          } else {
            tester = false;
          }
          if (tester === false && createdNotifications.length > 0) {
            setNewNotification();
            addNotifications(
              createdNotifications.sort((a, b) => {
                return new Date(b.time) - new Date(a.time);
              })
            );
          }
        }
      })
      .catch((e) => {
        console.log(e);
        openSnackbar("error", "Error fetching Notification Data");
      });
  };

  const fetchData = async () => {
    const accessToken = localStorage.getItem("jwt");
    dc.GetData(API_URL + "/getEvents", accessToken)
      .then((resp) => {
        if (resp.data.success === true) {
          setCards(resp.data.data);
          setCards_help(resp.data.data);
          setLength(Math.ceil(resp.data.data.length / numOfEventsPerPage));
        }
      })
      .catch((e) => {
        console.log(e);
        openSnackbar("error", "Error fetching Event Data");
      });
  };

  const fetchCountries = async () => {
    await dc
      .GetData(API_URL + "/api/countries")
      .then((resp) => setCountries(resp.data.data))
      .catch((resp) => {
        console.log(resp);
      });
  };

  const fetchEventTypes = async () => {
    const accessToken = localStorage.getItem("jwt");
    dc.GetData(API_URL + "/api/getEventTypes", accessToken)
      .then((resp) => {
        setEventTypes(resp.data.data);
      })
      .catch((e) => console.log(e));
  };
  function handleTabChange(event, newValue) {
    setCurrentTab(newValue);
  }

  const paginationStyle = {
    fontSize: "1.5rem", // Povećajte veličinu fonta
  };

  const { theme, toggleTheme } = useTheme();

  // function sortCards(value) {
  //   let fakeCard = cards;

  //   if (value == 1) {
  //     fakeCard = cards.slice().sort((a, b) => {
  //             return b.time - a.time;
  //           })
  //   } else if (value == 2) {
  //     fakeCard = cards.slice().sort((a, b) => {
  //       return b.price - a.price;
  //     })
  //   } else if (value == 3) {
  //     fakeCard = cards.slice().sort((a, b) => {
  //       return a.price - b.price;
  //     })
  //   } else if (value == 4) {
  //     fakeCard = cards.slice().sort((a, b) => {
  //       return b.interest - a.interest;
  //     })
  //   }
  //   setCards(fakeCard)

  // }

  const handleChangePrice = (event, newValue) => {
    setSelectedPriceValue(newValue);
  };
  const handleChangeType = (event, newValue) => {
    setSelectedTypeValue(newValue);
  };

  function checkEventTime(eventTime) {
    const currentDate = new Date();

    const timeDifference = eventTime - currentDate;

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const thirtyDays = 30 * oneDay;

    if (
      eventTime.getDate() === currentDate.getDate() &&
      eventTime.getMonth() === currentDate.getMonth() &&
      eventTime.getFullYear() === currentDate.getFullYear()
    ) {
      return "is today";
    } else if (timeDifference > 0 && timeDifference <= oneWeek) {
      return "in the next week";
    } else if (timeDifference > 0 && timeDifference <= thirtyDays) {
      return "in the next 30 days";
    } else if (timeDifference < 0 && Math.abs(timeDifference) <= oneWeek) {
      return "in the past week";
    } else if (timeDifference < 0 && Math.abs(timeDifference) <= thirtyDays) {
      return "in the past 30 days";
    } else {
      return "out of specified ranges";
    }
  }

  const handleFilter = () => {
    const filteredCards = cards_help.filter((card) => {
      const cardPrice = card.price;
      if (selectedPriceValue === "free") {
        return cardPrice === 0;
      } else if (selectedPriceValue === "paid") {
        return cardPrice > 0;
      } else {
        return true;
      }
    });

    const filteredCards_country = filteredCards.filter((card) => {
      const cardCountry = card.country;
      if (selectedCountryValue !== "") {
        return cardCountry === selectedCountryValue;
      } else {
        return true;
      }
    });

    const filteredCards_type = filteredCards_country.filter((card) => {
      const cardType = card.type;
      if (selectedTypeValue !== "") {
        return cardType == selectedTypeValue;
      } else {
        return true;
      }
    });

    const filteredCards_time = filteredCards_type.filter((card) => {
      const cardTime = new Date(card.time);

      switch (selectedTimeValue) {
        case "today":
          return checkEventTime(cardTime) === "is today";
        case "week":
          return checkEventTime(cardTime) === "in the next week";
        case "month":
          return checkEventTime(cardTime) === "in the next 30 days";
        case "last_week":
          return checkEventTime(cardTime) === "in the past week";
        case "last_month":
          return checkEventTime(cardTime) === "in the past 30 days";
        default:
          return true;
      }
    });

    if (Array.isArray(filteredCards_time)) {
      const sizeOfCards = Math.ceil(
        filteredCards_time.length / numOfEventsPerPage
      );
      setLength(sizeOfCards);
    }

    setCards(filteredCards_time);
  };

  const handleChangeTime = (event) => {
    setSelectedTimeValue(event.target.value);
    // Ovdje možete dodati logiku ili akcije na promjenu odabrane vrijednosti
  };

  const clearFilter = () => {
    setCards(cards_help);
    setStupidClearState(1);
  };

  const [currentPage, setCurrentPage] = useState(1); // Postavljanje trenutne stranice na 1, kao primjer

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Very good way to clear filter :)
  useEffect(() => {
    if (stupidClearState === 1) {
      setSelectedCountryValue("");
      setSelectedPriceValue("");
      setSelectedTimeValue("");
      setSelectedTypeValue("");
      setStupidClearState(2);
    } else if (stupidClearState === 2) {
      handleFilter();
      setStupidClearState(0);
    }
  }, [stupidClearState]);

  return (
    <ProtectedComponent roles={[0, 1, -1]}>
      <Paper
        sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh" }}
      >
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
                  backgroundColor: theme.palette.primary.main,
                },
              }}
              textColor="inherit"
            >
              <Tab label="Popular" sx={{ color: theme.palette.text.main }} />
              <Tab label="Soonest" sx={{ color: theme.palette.text.main }} />
              <Tab label="Oldest" sx={{ color: theme.palette.text.main }} />
              <Tab
                label="Least Expensive"
                sx={{ color: theme.palette.text.main }}
              />
              <Tab
                label="Most Expensive"
                sx={{ color: theme.palette.text.main }}
              />
            </Tabs>

            <div>
              <br></br>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Box>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        onClick={(event) => {
                          setAnchorElType(event.currentTarget);
                        }}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        Type
                      </Button>
                      <Menu
                        open={Boolean(anchorElType)}
                        anchorEl={anchorElType}
                        onClose={() => {
                          setAnchorElType(null);
                        }}
                      >
                        <RadioGroup
                          aria-label="gender"
                          name="gender"
                          value={selectedTypeValue}
                          onChange={handleChangeType}
                        >
                          {eventTypes.map((type) => (
                            <FormControlLabel
                              value={type.typeName}
                              control={<Radio />}
                              label={type.typeName}
                            />
                          ))}
                        </RadioGroup>
                      </Menu>

                      <Button
                        onClick={(event) => {
                          setAnchorElPrice(event.currentTarget);
                        }}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        Price
                      </Button>
                      <Menu
                        open={Boolean(anchorElPrice)}
                        anchorEl={anchorElPrice}
                        onClose={() => {
                          setAnchorElPrice(null);
                        }}
                      >
                        <FormControl component="fieldset">
                          <RadioGroup
                            aria-label="gender"
                            name="gender"
                            value={selectedPriceValue}
                            onChange={handleChangePrice}
                          >
                            <FormControlLabel
                              value="free"
                              control={<Radio />}
                              label="Free"
                            />
                            <FormControlLabel
                              value="paid"
                              control={<Radio />}
                              label="Paid"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Menu>

                      <Button
                        onClick={(event) => {
                          setAnchorElTime(event.currentTarget);
                        }}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        Time
                      </Button>
                      <Menu
                        open={Boolean(anchorElTime)}
                        anchorEl={anchorElTime}
                        onClose={() => {
                          setAnchorElTime(null);
                        }}
                      >
                        <FormControl component="fieldset">
                          <RadioGroup
                            aria-label="gender"
                            name="gender"
                            value={selectedTimeValue}
                            onChange={handleChangeTime}
                          >
                            <FormControlLabel
                              value="today"
                              control={<Radio />}
                              label="Today"
                            />
                            <FormControlLabel
                              value="week"
                              control={<Radio />}
                              label="Next 7 Days"
                            />
                            <FormControlLabel
                              value="month"
                              control={<Radio />}
                              label="Next 30 Days"
                            />
                            <FormControlLabel
                              value="last_week"
                              control={<Radio />}
                              label="Last 7 Days"
                            />
                            <FormControlLabel
                              value="last_month"
                              control={<Radio />}
                              label="Last 30 Days"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Menu>

                      <Button
                        onClick={(event) => {
                          setAnchorElCountry(event.currentTarget);
                        }}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        Country
                      </Button>
                      <Menu
                        open={Boolean(anchorElCountry)}
                        anchorEl={anchorElCountry}
                        onClose={() => {
                          setAnchorElCountry(null);
                        }}
                      >
                        {/* <RadioGroup
                          aria-label="gender"
                          name="gender"
                          value={selectedCountryValue}
                          onChange={handleChangeCountry}
                        > */}
                        {countries != null ? (
                          countries.map((country) => (
                            <MenuItem
                              key={country.countryCode}
                              value={country.countryCode}
                              onClick={() => {
                                setSelectedCountryValue(country.countryCode);
                                setAnchorElCountry(null);
                              }}
                            >
                              {country.name}
                            </MenuItem>
                            // <FormControlLabel
                            //   value={country.countryCode}
                            //   control={<Radio />}
                            //   label={country.name}
                            // />
                          ))
                        ) : (
                          <MenuItem value={""}>Loading...</MenuItem>
                        )}
                        {/* </RadioGroup> */}
                      </Menu>
                    </div>

                    <Box sx={{ display: "flex", position: "center" }}>
                      <Button
                        variant="outlined"
                        onClick={handleFilter}
                        sx={{ ml: 1, mr: 1, color: theme.palette.primary.main }}
                      >
                        Apply Filter
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          clearFilter();
                        }}
                        sx={{ ml: 1, color: theme.palette.primary.main }}
                      >
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
                  cards
                    .sort((a, b) => {
                      return b.interest - a.interest;
                    })
                    .slice(
                      (currentPage - 1) * numOfEventsPerPage,
                      currentPage * numOfEventsPerPage
                    )
                    .map((card) => (
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
              </Grid>
            ) : null}

            {currentTab === 1 ? (
              <Grid container spacing={4}>
                {cards && cards !== null ? (
                  cards
                    .filter((card) => {
                      const currentDate = new Date();
                      const objectDate = new Date(card.time);
                      return objectDate >= currentDate;
                    })
                    .sort((a, b) => {
                      const currentDate = new Date();
                      const dateA = new Date(a.time);
                      const dateB = new Date(b.time);

                      const distanceA = Math.abs(dateA - currentDate);
                      const distanceB = Math.abs(dateB - currentDate);

                      return distanceA - distanceB;
                    })
                    .slice(
                      (currentPage - 1) * numOfEventsPerPage,
                      currentPage * numOfEventsPerPage
                    )
                    .map((card) => (
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
              </Grid>
            ) : null}

            {currentTab === 2 ? (
              <Grid container spacing={4}>
                {cards && cards !== null ? (
                  cards
                    .filter((card) => {
                      const currentDate = new Date();
                      const objectDate = new Date(card.time);
                      return objectDate < currentDate;
                    })
                    .sort((a, b) => {
                      const dateA = new Date(a.time);
                      const dateB = new Date(b.time);

                      return dateA - dateB;
                    })
                    .slice(
                      (currentPage - 1) * numOfEventsPerPage,
                      currentPage * numOfEventsPerPage
                    )
                    .map((card) => (
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
              </Grid>
            ) : null}

            {currentTab === 3 ? (
              <Grid container spacing={4}>
                {cards && cards !== null ? (
                  cards
                    .sort((a, b) => {
                      const priceA = a.price;
                      const priceB = b.price;

                      return priceA - priceB;
                    })
                    .slice(
                      (currentPage - 1) * numOfEventsPerPage,
                      currentPage * numOfEventsPerPage
                    )
                    .map((card) => (
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
              </Grid>
            ) : null}

            {currentTab === 4 ? (
              <Grid container spacing={4}>
                {cards && cards !== null ? (
                  cards
                    .sort((a, b) => {
                      const priceA = a.price;
                      const priceB = b.price;

                      return priceB - priceA;
                    })
                    .slice(
                      (currentPage - 1) * numOfEventsPerPage,
                      currentPage * numOfEventsPerPage
                    )
                    .map((card) => (
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
              </Grid>
            ) : null}

            <br></br>

            <Stack spacing={2} /*sx={centerStyle}*/>
              <Pagination
                count={length}
                sx={paginationStyle}
                page={currentPage}
                onChange={handlePageChange}
              />
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
