import React from "react";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import EventTable from "../ui/EventTable";
import { useParams } from "react-router-dom";

export default function AdminBrowseUsers() {
  const { accountId } = useParams();
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
      <EventTable accountId={accountId}></EventTable>
      <MainFooter></MainFooter>
    </div>
  );
}
