import { dblClick } from "@testing-library/user-event/dist/click";
import React, { useEffect, useState } from "react";
import dataController from "../utils/DataController";

export default function UserUploadedImage(props) {
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
  }, []);

  return (
    <div {...props}>
      {image && (
        <img
          src={image}
          alt="img"
          style={{ width: "100%", height: "100%" }} // Adjust the styles as needed
        />
      )}
    </div>
  );
}
