import React from "react";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import UserTable from "../ui/UserTable";
import { Box } from "@mui/material";
export default function AdminBrowseUsers() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <MainHeader></MainHeader>
      <Box sx={{ padding: "1rem 1rem" }}>
        <UserTable></UserTable>
      </Box>
      <Box style={{ marginTop: "auto" }}>
        <MainFooter></MainFooter>
      </Box>
    </div>
  );
}
