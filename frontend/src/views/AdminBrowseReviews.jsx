import React from "react";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import ReviewTable from "../ui/ReviewTable";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

export default function AdminBrowseUsers() {
  const { accountId } = useParams();
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
        <ReviewTable accountId={accountId}></ReviewTable>
      </Box>

      <Box style={{ marginTop: "auto" }}>
        <MainFooter></MainFooter>
      </Box>
    </div>
  );
}
