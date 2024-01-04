import React from "react";
import ImageUploadButton from "../ui/ImageUploadButton";
import UserUploadedImage from "../ui/UserUploadedImage";

export default function UploadImagePageTemp(props) {
  return (
    <div {...props}>
      <ImageUploadButton
        route="/api/upload"
        style={{ width: "200px", outerHeight: "100px" }}
      ></ImageUploadButton>
      <UserUploadedImage src="/image-demso.png"></UserUploadedImage>
    </div>
  );
}
