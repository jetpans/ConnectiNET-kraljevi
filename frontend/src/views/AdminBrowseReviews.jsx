import React from "react";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import ReviewTable from "../ui/ReviewTable";
import { useParams } from "react-router-dom";
import { Box, CssBaseline, Paper } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { ProtectedComponent } from "../utils/ProtectedComponent";

export default function AdminBrowseUsers() {
  const { accountId } = useParams();
  const { theme, toggleTheme } = useTheme();

  return (
    <ProtectedComponent roles={[-1]}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <MainHeader></MainHeader>
        <Paper sx={{ bgcolor: theme.palette.background.default, borderRadius: '0px' }}>
        <Box sx={{ padding: "1rem 1rem", minHeight: '85vh' }}>
          <ReviewTable accountId={accountId}></ReviewTable>
        </Box>

        <Box style={{ marginTop: "auto" }}>
          <MainFooter></MainFooter>
        </Box>
        </Paper>
      </div>
    </ProtectedComponent>
  );
}
