import React from "react";
import ImageUploadButton from "../ui/ImageUploadButton";
import UserUploadedImage from "../ui/UserUploadedImage";

export default function UploadImagePageTemp() {
  return (
    <div>
      <ImageUploadButton
        route="/user/upload"
        style={{ width: "200px", outerHeight: "100px" }}
      ></ImageUploadButton>
      <UserUploadedImage route="/user/fetch"></UserUploadedImage>
    </div>
  );
}
