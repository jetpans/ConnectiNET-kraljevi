import { dblClick } from "@testing-library/user-event/dist/click";
import React, { useEffect, useState } from "react";
import dataController from "../utils/DataController";
import { Avatar } from "@mui/material";

export default function UserUploadedAvatar(props) {
  const [image, setImage] = useState(null);
  const dc = new dataController();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    dc.FetchFile(API_URL + "/api/image" + props.src, null)
      .then((resp) => {
        return resp.blob();
      })
      .then((blob) => setImage(URL.createObjectURL(blob)))
      .catch((e) => {
        console.error(e);
      });
  }, [props]);

  return (
    <div {...props}>
      {image && (
        <Avatar alt="img" src={image} />
      )}
    </div>
  );
}
