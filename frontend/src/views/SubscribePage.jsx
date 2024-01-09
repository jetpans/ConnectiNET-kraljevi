import * as React from "react";
import Avatar from "@mui/material/Avatar";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import dataController from "../utils/DataController";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Navigate, useLoaderData } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

import { useState, useContext, useEffect } from "react";
import { Block, Pattern } from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import { useDialog } from "../context/DialogContext";
import { useSnackbar } from "../context/SnackbarContext";

export default function SubscribePage(props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dc = new dataController();
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("jwt");
  const { theme, toggleTheme } = useTheme();
  const mainTheme = theme;

  const { openSnackbar } = useSnackbar();

  const { openDialog, closeDialog } = useDialog();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [dateData, setDateData] = useState({
    isSubscribed: "True",
    startDate: "",
    expireDate: "",
  });

  const handleClickCard = (event) => {
    const kartica = document.getElementById("kartica");
    const opcija = document.getElementById("opcija");
    kartica.style.display = "block";
    opcija.style.display = "none";
  };

  const handleClickPayPal = (event) => {
    const paypal = document.getElementById("paypal");
    const opcija = document.getElementById("opcija");
    paypal.style.display = "block";
    opcija.style.display = "none";
  };

  const handleSubmitCard = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const payDataCard = {
      method: "card",
      cardNumber: data.get("card_number"),
      cardDate: data.get("card_date"),
      cvv: data.get("cvv"),
    };
    const dc = new dataController();
    if (dateData.isSubscribed == "True") {
      dc.PostData(API_URL + "/api/extendSubscribe", payDataCard, accessToken)
        .then((resp) => {
          if (resp.success == true && resp.data.success === true) {
            navigate(0);

            openSnackbar("success", "Payment successful");
          } else if (resp.success == true && resp.data.success == false) {
            openSnackbar("error", resp.data.message);
          } else {
            openSnackbar("error", "Failed");
          }
        })
        .catch((resp) => {
          openSnackbar("error", "Failed.");
        });
    } else {
      dc.PostData(API_URL + "/api/subscribe", payDataCard, accessToken)
        .then((resp) => {
          if (resp.success == true && resp.data.success === true) {
            openSnackbar("success", "Payment successful");
            navigate(0);
          } else if (resp.success == true && resp.data.success == false) {
            openSnackbar("error", resp.data.message);
          } else {
            openSnackbar("error", "Failed");
          }
        })
        .catch((resp) => {
          openSnackbar("error", "Failed.");
        });
    }
  };

  const handleSubmitPayPal = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const payDataPayPal = {
      method: "paypal",
      payPalUsername: data.get("paypal_username"),
      payPalPassword: data.get("paypal_password"),
    };
    const dc = new dataController();

    if (dateData.isSubscribed) {
      dc.PostData(API_URL + "/api/extendSubscribe", payDataPayPal, accessToken)
        .then((resp) => {
          if (resp.success == true && resp.data.success === true) {
            navigate(0);

            openSnackbar("success", "Payment successful");
          } else if (resp.success == true && resp.data.success == false) {
            openSnackbar("error", resp.data.message);
          } else {
            openSnackbar("error", "Failed");
          }
        })
        .catch((resp) => {
          openSnackbar("error", "Failed.");
        });
    } else {
      dc.PostData(API_URL + "/api/subscribe", payDataPayPal, accessToken)
        .then((resp) => {
          if (resp.success === true && resp.data.success === true) {
            openSnackbar("success", "Payment successful");
            navigate(0);
          } else if (resp.success === false) {
            openSnackbar("error", resp.data.message);
          } else {
            openSnackbar("error", "Failed");
          }
        })
        .catch((resp) => {
          openSnackbar("error", "Failed");
        });
    }
  };

  const handleCancelSubscription = (event) => {
    dc.PostData(API_URL + "/api/unsubscribe", "", accessToken)
      .then((resp) => {
        if (resp.success === true && resp.data.success === true) {
          openSnackbar("success", "Payment successful");
          navigate(0);
        } else if (resp.success === false) {
          openSnackbar("error", resp.data.message);
        } else {
          openSnackbar("error", "Failed");
        }
      })
      .catch((resp) => {
        openSnackbar("error", "Failed");
      });
  };

  const fetchData = async () => {
    dc.GetData(
      API_URL + "/api/getSubscriberInfo",
      localStorage.getItem("jwt")
    ).then((resp) => {
      setDateData(resp.data.data);
    });
  };

  useEffect(() => {
    setDialogOpen(false);
    if (accessToken === null) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [navigate]);

  const ChooseDialog = () => {
    return (
      <Card
        id="opcija"
        variant="outlined"
        sx={{ width: 400, minHeight: "300px", marginTop: "0vh" }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ marginBottom: "45px" }}
          >
            Choose a payment option
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: "0px",
            alignContent: "center",
            justifyItems: "space-between",
          }}
        >
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={() => {openDialog(KarticaDialog)}} variant="contained">
                Pay by card
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={() => {openDialog(PaypalDialog)}} variant="contained">
                Pay with PayPal
              </Button>
            </Grid>
          </Grid>
        </CardActions>

        <CardActions
          sx={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: "50px",
          }}
        >
          <Button onClick={closeDialog} size="small" variant="outlined">
            Close
          </Button>
        </CardActions>
      </Card>
    )
  }

  const KarticaDialog = () => {
    return (
      <Card
        id="kartica"
        variant="outlined"
        sx={{
          width: 345,
          minHeight: "350px",
          marginTop: "0vh",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ marginBottom: "45px" }}
          >
            Payment by card
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmitCard}
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              id="card_number"
              name="card_number"
              required
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 16,
              }}
              label="Card number"
              placeholder="xxxxxxxxxxxxxxx"
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              required
              id="card_date"
              name="card_date"
              inputProps={{
                inputMode: "numeric",
                pattern: "\\d\\d/\\d\\d",
                maxLength: 5,
              }}
              label="Card date"
              placeholder="MM/YY"
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              required
              id="cvv"
              name="cvv"
              label="Cvv"
              placeholder="xxx"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 3,
              }}
            />
            <CardActions
              sx={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <Button size="small" type="submit" variant="contained">
                Confirm transaction
              </Button>
            </CardActions>
            <CardActions
              sx={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: "50px",
              }}
            >
              <Button onClick={closeDialog} size="small" variant="outlined">
                Close
              </Button>
            </CardActions>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const PaypalDialog = () => {
    return (
      <Card
        id="paypal"
        variant="outlined"
        sx={{
          width: 345,
          minHeight: "350px",
          marginTop: "0vh",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ marginBottom: "45px" }}
          >
            Payment by PayPal
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmitPayPal}
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              id="paypal_username"
              name="paypal_username"
              label="Paypal username"
              type="username"
              placeholder="Enter paypal username"
              inputProps={{
                inputMode: "text",
                maxLength: 30
              }}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              id="paypal_password"
              name="paypal_password"
              label="Paypal password"
              type="password"
              inputProps={{
                inputMode: "text",
                maxLength: 30
              }}
              sx={{ marginBottom: "10px" }}
            />
            <CardActions
              sx={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <Button size="small" type="submit" variant="contained">
                Confirm transaction
              </Button>
            </CardActions>
            <CardActions
              sx={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: "50px",
              }}
            >
              <Button onClick={closeDialog} size="small" variant="outlined">
                Close
              </Button>
            </CardActions>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <ProtectedComponent roles={[1, -1]}>
      <Paper
        sx={{
          bgcolor: mainTheme.palette.background.default,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CssBaseline />
        <MainHeader for="Account" />
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {dateData.isSubscribed ? (
        <Card
          variant="outlined"
          sx={{ width: "35%", height: "50vh", minWidth: 350, minHeight: 350, marginTop: "0vh" }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ marginBottom: "45px" }}
            >
              Welcome {userData.username}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: "15px" }}
            >
              Subscription status:
              {dateData.isSubscribed === "True"
                ? "Subscribed"
                : "Nije pretplaćen"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Subscribed from {dateData.startDate} to {dateData.expireDate}
            </Typography>
          </CardContent>

          <CardActions
            sx={{
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <Button size="small" onClick={() => handleCancelSubscription()}>
              Cancel subscription
            </Button>
            <Button size="small" onClick={() => openDialog(ChooseDialog)}>
              Extend subscription
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Card
          variant="outlined"
          sx={{ width: 345, minHeight: "350px", marginTop: "0vh" }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ marginBottom: "45px" }}
            >
              Welcome {userData.username}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: "15px" }}
            >
              Subscription status: Not subscribed
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Price: 10$/mth
            </Typography>
          </CardContent>

          <CardActions
            sx={{
              flexDirection: "column",
              alignItems: "center",
              marginTop: "65px",
            }}
          >
            <Button
              size="small"
              onClick={() => {
                openDialog(ChooseDialog);
              }}
              variant="contained"
            >
              Subscribe
            </Button>
          </CardActions>
        </Card>
      )}
      
      </div>
      <MainFooter />
      </ Paper>
      </ ProtectedComponent>
  );
}
