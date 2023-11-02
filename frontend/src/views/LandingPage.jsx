import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:5000/getThing", {
        method: "GET",
      });
      if (resp.ok) {
        const respJson = await resp.json();
        // setData(respJson);
      }
    } catch {
      console.error("Bad!");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      {/*<div>{data ? data : "Loading.."}</div>*/}
      <Button onClick={() => {navigate('/events')}} >Click me to view events</Button>
    </div>
  );
}