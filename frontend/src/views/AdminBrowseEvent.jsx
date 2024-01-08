import React from "react";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import EventTable from "../ui/EventTable";

export default function AdminBrowseUsers() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      

      <EventTable></EventTable>
     
    </div>
  );
}
