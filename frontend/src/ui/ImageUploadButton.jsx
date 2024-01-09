import React, { useState } from "react";
import dataController from "../utils/DataController";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Button, InputLabel, Chip } from "@mui/material";
import { useSnackbar } from "../context/SnackbarContext";
import { useTheme } from "../context/ThemeContext";

export default function ImageUploadButton(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("jwt");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const { openSnackbar } = useSnackbar();


  const dc = new dataController();

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    const MAX_IMAGE_SIZE_KB = 2000;
    const KB = 1024;
    if (imageFile.size > MAX_IMAGE_SIZE_KB * KB) {
      openSnackbar('error', 'Image is larger than 2MB, not good.');
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
      openSnackbar('error', 'Please select an image before uploading.');
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

            openSnackbar('success', 'Image uploaded successfully.');

          } else {
            openSnackbar('error', 'Error uploading image.');
          }
        });
    } catch (e) {
      openSnackbar('error', e);
    }
  };

  const { theme } = useTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", ...props.style }}>
      <InputLabel htmlFor="image" style={{ width: "100%", marginTop: 2 }}>
        <Button variant="contained" component="span" style={{ width: "100%", marginTop: 10 }}>
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
        sx={{color: theme.palette.text.main, marginTop: 2}}
        label={selectedImage ? selectedImage.name : "Image not selected."}
      />
      {/* {previewImage && (
        <div>
          <h2>Preview:</h2>
          <img src={previewImage} alt="Preview" style={{ maxWidth: "100%" }} />
        </div>
      )} */}
      <Button
        mt={2}
        onClick={handleUpload}
        variant="outlined"
        component="span"
        disabled={selectedImage === null}
        sx={{color: theme.palette.text.main, marginTop: 2}}
      >
        Upload Image
      </Button>
    </div>
  );
}
