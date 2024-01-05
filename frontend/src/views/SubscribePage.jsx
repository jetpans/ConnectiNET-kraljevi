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
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

import { useState, useContext, useEffect } from "react";
import { Block, Pattern } from "@mui/icons-material";

export default function SubscribePage(props) {
  const dc = new dataController();
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("jwt");
  /*
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [dateData, setDateData] = useState({
    isSubscribed: "True",
    startDate: "",
    expireDate: "",
  }); */
  const dateData = true;
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
    console.log("bok");
    const data = new FormData(event.currentTarget);

    const payDataCard = {
      cardNumber: data.get("card_number"),
      cardDate: data.get("card_date"),
      cvv: data.get("cvv"),
    };
    console.log(payDataCard);
    const dc = new dataController();

   
    dc.PostData(API_URL + "/subscribe", payDataCard)
      .then((resp) => {
        if (resp.success === true && resp.data.success === true) {
          // console.log('Success!');
          // todo: add "token": resp.data.token
          // updateCard({
          // "cardNumber": payDataCard.cardNumber,
          // "cardDate": payDataCard.cardDate,
          // "cvv": payDataCard.cvv,
          
          // });
          alert("Registration successful! Please log in.");
          navigate("/subscribe");
        }/* else {
          // console.log('Error!');
          // console.log(resp.data);
          if (resp.data.data === "Username already in use.") {
            alert("Registration unsuccessful. Username already exists.");
            return;
          }
          alert("Registration unsuccessful. " + resp.data.data);
        }*/
      })
      .catch((resp) => {
        alert("Registration unsuccessful. " + resp.data.data);
      });
  };

  const handleSubmitPayPal = (event) => {
    event.preventDefault();
    console.log("bok");
    const data = new FormData(event.currentTarget);

    const payDataPayPal = {
      payPalUsername: data.get("paypal_username"),
      payPalPassword: data.get("paypal_password"),
      cvv: data.get("cvv"),
    };
    console.log(payDataPayPal);
    const dc = new dataController();

   
    dc.PostData(API_URL + "/subscribe", payDataPayPal)
      .then((resp) => {
        if (resp.success === true && resp.data.success === true) {
          // console.log('Success!');
          // todo: add "token": resp.data.token
          // updateCard({
          // "payPalUsername": payDataPayPal.payPalUsername,
          // "payPalPassword": payDataPayPal.payPalPassword,
          
          // });
          alert("Registration successful! Please log in.");
          navigate("/subscribe");
        }/* else {
          // console.log('Error!');
          // console.log(resp.data);
          if (resp.data.data === "Username already in use.") {
            alert("Registration unsuccessful. Username already exists.");
            return;
          }
          alert("Registration unsuccessful. " + resp.data.data);
        }*/
      })
      .catch((resp) => {
        alert("Registration unsuccessful. " + resp.data.data);
      });
  };
  /*
  const fetchData = async () => {
    dc.GetData(
      API_URL + "/api/getSubscriberInfo",
      localStorage.getItem("jwt")
    ).then((resp) => {
      console.log(resp.data);
      setDateData(resp.data.data);
    });
  };

  useEffect(() => {
    if (accessToken === null) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, []);*/
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {dateData /*.isSubscribed */ ? (
        <Card
          variant="outlined"
          sx={{ width: 345, minHeight: "350px", marginTop: "25vh" }}
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
              Welcome {/*userData.username*/}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: "15px" }}
            >
              Subscription status: Subscribed
              {/*dateData.isSubscribed === "True"
                ? "Subscribed"
          : "Nije pretplaćen"*/}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Subscribed from {/*dateData.startDate*/} to{" "}
              {/*dateData.expireDate*/}
            </Typography>
          </CardContent>

          <CardActions
            sx={{
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <Button size="small">Cancle subscription</Button>
            <Button size="small">Change payment</Button>
          </CardActions>
        </Card>
      ) : (
        <Card
          variant="outlined"
          sx={{ width: 345, minHeight: "350px", marginTop: "25vh" }}
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
              Welcome {/*userData.username*/}
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
              marginTop: "20px",
            }}
          >
            <Button size="small">Subscribe</Button>
          </CardActions>
        </Card>
      )}
      <Card
        id="opcija"
        variant="outlined"
        sx={{ width: 345, minHeight: "350px", marginTop: "25vh" }}
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
            marginTop: "20px",
          }}
        >
          <Button onClick={handleClickCard} size="small">
            Pay by card
          </Button>
          <Button onClick={handleClickPayPal} size="small">
            Pay with PayPal
          </Button>
        </CardActions>
      </Card>
      <Card
        id="kartica"
        variant="outlined"
        sx={{
          width: 345,
          minHeight: "350px",
          marginTop: "25vh",
          display: "none",
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
            noValidate
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
                pattern: "",
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
              <Button size="small" type="submit">
                Confirm transaction
              </Button>
            </CardActions>
          </Box>
        </CardContent>
      </Card>
      <Card
        id="paypal"
        variant="outlined"
        sx={{
          width: 345,
          minHeight: "350px",
          marginTop: "25vh",
          display: "none",
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
            noValidate
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
              type="email"
              placeholder="Enter paypal username"
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              id="paypal_password"
              name="paypal_password"
              label="Paypal password"
              placeholder="Enter paypal password"
              type="password"
              sx={{ marginBottom: "10px" }}
            />
            <CardActions
              sx={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <Button size="small" type="submit">
                Confirm transaction
              </Button>
            </CardActions>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
