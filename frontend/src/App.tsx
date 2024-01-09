import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import LandingPage from "./views/LandingPage";
import EventsPage from "./views/EventsPage";
import RegisterPage from "./views/RegisterPage";
import UploadImagePageTemp from "./views/UploadImagePageTemp";
import SubscribePage from "./views/SubscribePage";
import AccountPage from "./views/AccountPage";
import AdminSubscriptionPage from "./views/AdminSubscriptionPage";
import CreateEventsPage from "./views/CreateEventsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/premium" element={<SubscribePage />} />
        <Route path="/adminsubscription" element={<AdminSubscriptionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/temp" element={<UploadImagePageTemp />} />
        <Route path="/create" element={<CreateEventsPage />} />  

        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
