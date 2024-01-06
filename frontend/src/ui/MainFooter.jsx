import React from "react";
import { green, grey, indigo } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function MainFooter() {
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

  const mainTheme = lightTheme;
  return (
    <div>
      <Box
        sx={{ bgcolor: mainTheme.palette.primary.main, p: 4.5 }}
        component="footer"
      >
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          color={mainTheme.palette.secondary.other}
        >
          ConnectiNET
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color={mainTheme.palette.secondary.other}
        >
          by Kraljevi
        </Typography>
      </Box>
    </div>
  );
}
