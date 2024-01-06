import React from "react";
import ImageUploadButton from "../ui/ImageUploadButton";
import UserUploadedImage from "../ui/UserUploadedImage";

import MainHeader from "../ui/MainHeader";
import MainFooter from "../ui/MainFooter";
export default function UploadImagePageTemp() {
  return (
    <div>
      <MainHeader />

      <ImageUploadButton
        route="/api/upload"
        style={{ width: "200px", outerHeight: "100px" }}
      ></ImageUploadButton>
      <UserUploadedImage src="/image-demso.png"></UserUploadedImage>

      <MainFooter></MainFooter>
    </div>
  );
}
