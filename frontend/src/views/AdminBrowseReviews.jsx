import React from "react";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import ReviewTable from "../ui/ReviewTable";
import { useParams } from "react-router-dom";

export default function AdminBrowseUsers() {
  const { eventId } = useParams();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
      }}
    >
      <MainHeader></MainHeader>
      <ReviewTable eventId={eventId}></ReviewTable>
      <MainFooter></MainFooter>
    </div>
  );
}