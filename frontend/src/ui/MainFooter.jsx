import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "../context/ThemeContext";

export default function MainFooter() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <Box
        sx={{ bgcolor: theme.palette.primary.main, p: 4.5 }}
        component="footer"
      >
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          color={theme.palette.secondary.light}
        >
          ConnectiNET
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color={theme.palette.secondary.light}
        >
          by Kraljevi
        </Typography>
      </Box>
    </div>
  );
}
