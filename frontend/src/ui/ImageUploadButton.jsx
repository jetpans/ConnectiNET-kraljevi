import React, { useState } from "react";
import dataController from "../utils/DataController";

import { Button, InputLabel, Chip } from "@mui/material";
export default function ImageUploadButton(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("jwt");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const dc = new dataController();

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    const MAX_IMAGE_SIZE_KB = 2000;
    const KB = 1024;
    if (imageFile.size > MAX_IMAGE_SIZE_KB * KB) {
      alert("Image is larger than 2MB, not good.");
      return;
    }
    setSelectedImage(imageFile);
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      setPreviewImage(imageUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      console.error("Please select an image before uploading.");
      alert("Please select an image before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      await dc
        .PostFile(API_URL + props.route, formData, accessToken)
        .then((resp) => {
          // console.log("THIS:", resp.data);
          if (resp.data.success === true) {
            alert("Success");
          } else {
            alert("Fail");
          }
        });
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", ...props.style }}>
      <InputLabel htmlFor="image" style={{ width: "100%" }}>
        <Button variant="contained" component="span" style={{ width: "100%" }}>
          Choose File
        </Button>
      </InputLabel>
      <input
        type="file"
        accept="image/*"
        id="image"
        formEncType="multipart/form-data"
        onChange={handleImageChange}
        hidden={true}
      />

      <Chip
        label={selectedImage ? selectedImage.name : "Image not selected."}
      />
      {/* {previewImage && (
        <div>
          <h2>Preview:</h2>
          <img src={previewImage} alt="Preview" style={{ maxWidth: "100%" }} />
        </div>
      )} */}
      <Button
        onClick={handleUpload}
        variant="outlined"
        component="span"
        disabled={selectedImage === null}
      >
        Upload Image
      </Button>
    </div>
  );
}
