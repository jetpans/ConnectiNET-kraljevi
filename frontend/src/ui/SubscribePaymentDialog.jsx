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
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import { useDialog } from "../context/DialogContext";

export const PaymentSelectDialog = () => {
  return (
    <Card
      id="opcija"
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
    </Card>)
}
