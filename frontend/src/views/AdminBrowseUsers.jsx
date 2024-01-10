import React from "react";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import UserTable from "../ui/UserTable";
import { Box, CssBaseline, Paper } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { ProtectedComponent } from "../utils/ProtectedComponent";

export default function AdminBrowseUsers() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ProtectedComponent roles={[-1]}>
      <MainHeader></MainHeader>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5"
        }}
      >
        
        <Paper sx={{ bgcolor: theme.palette.background.default, borderRadius: '0px' }}>
          <CssBaseline />
          <Box sx={{ padding: "1rem 1rem", minHeight: '85vh' }}>
            <UserTable></UserTable>
          </Box>
          <Box style={{ marginTop: "auto" }}>
            <MainFooter></MainFooter>
          </Box>
        </Paper>
      </div>
    </ProtectedComponent>
  );
}
