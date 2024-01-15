import { dblClick } from "@testing-library/user-event/dist/click";
import React, { useEffect, useState } from "react";
import dataController from "../utils/DataController";
import { Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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
        if (blob.type === "application/json") {
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
    <div style={{ overflowX: 'hidden', display: 'flex', position: 'center' }}>
      {props.src && props.src !== null ? (
        <img
          src={props.src}
          alt=""
          style={{ width: '80vw', height: '30vh', aspectRatio: '16/9', objectFit: 'cover', overflow: "hidden" }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
