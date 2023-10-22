import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OtherPage from "./views/LoginPage";
import LandingPage from "./views/LandingPage";
import EventsPage from "./views/EventsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/login" element={<OtherPage />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
