import * as React from "react";
import Avatar from "@mui/material/Avatar";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Paper, TableCell, TableRow } from "@mui/material";
import dataController from "../utils/DataController";
import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";
import PropTypes from "prop-types";
import { Button } from "@mui/material"
import { styled } from "@mui/system";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";

import { useState, useEffect } from "react";
import MainHeader from "../ui/MainHeader.jsx";
import MainFooter from "../ui/MainFooter";
import { dblClick } from "@testing-library/user-event/dist/click";
import { ProtectedComponent } from "../utils/ProtectedComponent";
import { useSnackbar } from "../context/SnackbarContext";
import { useTheme } from "../context/ThemeContext";

export default function AdminSubscription(props) {
  const [value, setValue] = useState(0);
  const [price, setPrice] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;
  const dc = new dataController();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("jwt");

  const { openSnackbar } = useSnackbar();

  const fetchData = () => {
    dc.GetData(API_URL + "/api/getSubscriptionPrice", accessToken)
      .then((resp) => setPrice(resp.data.data.value))
      .catch((e) => console.log(e));
  };

  const handleClick = () => {
    const result = { newPrice: value };
    dc.PostData(API_URL + "/api/setSubscriptionPrice", result, accessToken)
      .then((resp) => {
        if (resp.data.success === true) {
          openSnackbar("success", "Successfuly set price.");
          setTimeout(() => {
            navigate(0);
          }, 1000);
        } else {
          openSnackbar("error", "Failed to set price.");
        }
      })
      .catch((e) => console.log(e));
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const { theme, toggleTheme } = useTheme();

  return (
    <ProtectedComponent roles={[-1]}>
      <MainHeader></MainHeader>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "0px",
          alignSelf: "center",
          bgcolor: theme.palette.background.default,
          minHeight: "78vh"
        }}
      >
        <Paper
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "45vw",
            height: "45vh",
            borderRadius: "10px",
            bgcolor: theme.palette.background.table
          }}
        >
          <Typography variant="h5" noWrap sx={{ marginTop: "35px"}} color={theme.palette.text.main}>
            Set New ConnectiNET Premium Monthly Subscription Price
          </Typography>

          <Typography variant="h6" noWrap sx={{ marginTop: "35px" }} color={theme.palette.text.main}>
            Current Subscription Price: {price} $
          </Typography>
          
          <TextField
            inputProps={{ type: "number", min: 0, value: value }}
            aria-label="Demo number input"
            placeholder="Type a number…"
            onChange={(e) => {
              setValue(e.target.value);
            }}
            sx={{ marginBottom: "20px", marginTop: "25px", input: { color: theme.palette.text.main } }}
          />
          <Button variant="contained" sx={{color: theme.palette.text.white, bgcolor: theme.palette.primary.main, marginTop: "25px" }} onClick={handleClick}>Set Subsciption Price</Button>
        </Paper>
      </Paper>

      <MainFooter></MainFooter>
    </ProtectedComponent>
  );
}
