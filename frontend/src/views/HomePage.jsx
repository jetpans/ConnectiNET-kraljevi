import React, { useEffect, useState } from "react";

export default function HomePage() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:5000/getThing", {
        method: "GET",
      });
      if (resp.ok) {
        const respJson = await resp.json();
        setData(respJson);
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
      HomePage
      <div>{data ? data : "Loading.."}</div>{" "}
      <a>Hello</a>
      <a>Hello</a>
      <a>test</a>
    </div>
  );
}
