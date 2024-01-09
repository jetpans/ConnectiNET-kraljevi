import { dblClick } from "@testing-library/user-event/dist/click";
import React, { useEffect, useState } from "react";
import dataController from "../utils/DataController";
import { Avatar } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from "../context/ThemeContext";

export default function UserUploadedImage(props) {
  const [image, setImage] = useState(null);
  const dc = new dataController();
  const { theme } = useTheme();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    dc.FetchFile(API_URL + "/api/image" + props.src, null)
      .then((resp) => {
        return resp.blob();
      })
      .then((blob) => {
        if(blob.type === 'application/json') {
          setImage(null);
        } else {
          setImage(URL.createObjectURL(blob));
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [props]);

  return (
    <div {...props}>
      {image && image !== null ? (
        <img
          src={image}
          alt="img"
          style={{ width: "100%", height: "100%", maxHeight: 128, maxWidth: 128 }} // Adjust the styles as needed
        />
      ) : 
      <Avatar sx={{ color: theme.palette.background.default, bgcolor: theme.palette.primary.main, width: 128, height: 128 }}>
        <AccountCircleIcon color={theme.palette.background.default} sx={{width: 128, height: 128}}/>
      </Avatar>}
    </div>
  );
}
