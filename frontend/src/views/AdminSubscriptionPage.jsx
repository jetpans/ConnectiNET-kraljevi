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
import { Button, buttonClasses } from "@mui/base/Button";
import { styled } from "@mui/system";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";

import { useState, useContext, useEffect } from "react";
import MainHeader from "../ui/MainHeader.jsx";
import MainFooter from "../ui/MainFooter";
import { dblClick } from "@testing-library/user-event/dist/click";

export default function AdminSubscription(props) {
  const [value, setValue] = useState(0);
  const [price, setPrice] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;
  const dc = new dataController();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("jwt");
  const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
    return (
      <BaseNumberInput
        slots={{
          root: StyledInputRoot,
          input: StyledInputElement,
        }}
        slotProps={{
          incrementButton: {
            children: "▴",
          },
          decrementButton: {
            children: "▾",
            display: "none",
          },
        }}
        {...props}
      />
    );
  });
  const ButtonRoot = React.forwardRef(function ButtonRoot(props, ref) {
    const { children, ...other } = props;

    return (
      <svg width="150" height="50" {...other} ref={ref}>
        <polygon points="0,50 0,0 150,0 150,50" className="bg" />
        <polygon points="0,50 0,0 150,0 150,50" className="borderEffect" />
        <foreignObject x="0" y="0" width="150" height="50">
          <div className="content">{children}</div>
        </foreignObject>
      </svg>
    );
  });

  ButtonRoot.propTypes = {
    children: PropTypes.node,
  };

  const SvgButton = React.forwardRef(function SvgButton(props, ref) {
    return <Button {...props} slots={{ root: CustomButtonRoot }} ref={ref} />;
  });

  const CustomButtonRoot = styled(ButtonRoot)(
    ({ theme }) => `
    overflow: visible;
    cursor: pointer;
    --main-color: ${theme.palette.mode === "light" ? blue2[600] : blue2[200]};
    --hover-color: ${theme.palette.mode === "light" ? blue2[50] : blue2[900]};
    --active-color: ${theme.palette.mode === "light" ? blue2[100] : blue2[800]};
  
    & polygon {
      fill: transparent;
      transition: all 800ms ease;
      pointer-events: none;
    }
  
    & .bg {
      stroke: var(--main-color);
      stroke-width: 1;
      filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.1));
      fill: transparent;
    }
  
    & .borderEffect {
      stroke: var(--main-color);
      stroke-width: 2;
      stroke-dasharray: 120 600;
      stroke-dashoffset: 120;
      fill: transparent;
    }
  
    &:hover,
    &.${buttonClasses.focusVisible} {
      .borderEffect {
        stroke-dashoffset: -600;
      }
  
      .bg {
        fill: var(--hover-color);
      }
    }
  
    &:focus,
    &.${buttonClasses.focusVisible} {
      outline: 2px solid ${
        theme.palette.mode === "dark" ? blue2[700] : blue2[200]
      };
      outline-offset: 2px;
    }
  
    &.${buttonClasses.active} {
      & .bg {
        fill: var(--active-color);
        transition: fill 150ms ease-out;
      }
    }
  
    & foreignObject {
      pointer-events: none;
  
      & .content {
        font-size: 0.875rem;
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: 600;
        line-height: 1.5;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--main-color);
      }
  
      & svg {
        margin: 0 4px;
      }
    }`
  );

  const blue = {
    100: "#DAECFF",
    200: "#80BFFF",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
  };

  const blue2 = {
    50: "#F0F7FF",
    100: "#C2E0FF",
    200: "#99CCF3",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E6",
    700: "#0059B3",
    800: "#004C99",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const StyledInputRoot = styled("div")(
    ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === "dark" ? grey[900] : grey[50]
  };
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  column-gap: 4px;
  padding: 1px;
 

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[600] : blue[200]
    };
  }

  &:hover {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
  );

  const StyledInputElement = styled("input")(
    ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-column: 1/2;
  grid-row: 1/3;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 4px 6px;
  outline: 0;
  
`
  );

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
          alert("Success!");
          navigate(0);
        } else {
          alert("Failed to set price.");
        }
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f5f5f5",
      }}
    >
      <MainHeader for="Subscription"></MainHeader>

      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          width: "60rem",
          alignSelf: "center",
        }}
      >
        <Typography variant="h6" noWrap sx={{ marginTop: "15px" }}>
          Current subscription price: {price}
        </Typography>
        <Box
          sx={{
            display: "grid",

            justifyItems: "center",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h6" noWrap>
            Enter new subscription price:
          </Typography>
          <TextField
            inputProps={{ type: "number", min: 0, value: value }}
            aria-label="Demo number input"
            placeholder="Type a number…"
            onChange={(e) => {
              setValue(e.target.value);
            }}
            sx={{ marginBottom: "10px" }}
          />
          <SvgButton onClick={() => handleClick()}>Set price</SvgButton>
        </Box>
      </Paper>

      <MainFooter></MainFooter>
    </Box>
  );
}
