// import { dblClick } from "@testing-library/user-event/dist/click";
import React, { useEffect, useState } from "react";
import dataController from "../utils/DataController";
import { Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "../context/ThemeContext";

export default function UserUploadedAvatar(props) {
  const [image, setImage] = useState(null);
  const { theme } = useTheme();
  const dc = new dataController();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    return;
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
    <div {...props}>
      {props && props.src != null ? (
        <Avatar alt="img" src={props.src} sx={{ width: 30, height: 30 }} />
      ) : (
        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
          <AccountCircleIcon
            color={theme.palette.background.default}
            sx={{ width: 28, height: 28 }}
          />
        </Avatar>
      )}
    </div>
  );
}
