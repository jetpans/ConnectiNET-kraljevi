import { dblClick } from "@testing-library/user-event/dist/click";
import React, { useEffect, useState } from "react";
import dataController from "../utils/DataController";
import { Avatar } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from "../context/ThemeContext";

export default function UserUploadedEventImage(props) {
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
    <>
      {image && image !== null ? (
        <img
          src={image}
          alt="img"
          style={{ width: "100%", height: "100%", marginTop: 0 }} 
        />
      ) : null}
    </>
  );
}