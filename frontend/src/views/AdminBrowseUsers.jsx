import React from "react";
import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import UserTable from "../ui/UserTable";

export default function AdminBrowseUsers() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <MainHeader></MainHeader>

      <UserTable></UserTable>
      <MainFooter></MainFooter>
    </div>
  );
}
