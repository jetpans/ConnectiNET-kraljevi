import React from "react";
import ImageUploadButton from "../ui/ImageUploadButton";
import UserUploadedImage from "../ui/UserUploadedImage";

import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
import UserTable from "../ui/UserTable";
export default function UploadImagePageTemp() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
      }}
    >
      <MainHeader />
      <UserTable></UserTable>

      <MainFooter></MainFooter>
    </div>
  );
}
