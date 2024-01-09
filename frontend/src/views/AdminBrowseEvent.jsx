import React from "react";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import EventTable from "../ui/EventTable";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

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
        <EventTable accountId={accountId}></EventTable>
      </Box>
      <Box style={{ marginTop: "auto" }}>
        <MainFooter></MainFooter>
      </Box>{" "}
    </div>
  );
}
