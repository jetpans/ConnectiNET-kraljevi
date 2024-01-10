import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import LandingPage from "./views/LandingPage";
import EventsPage from "./views/EventsPage";
import RegisterPage from "./views/RegisterPage";
import SubscribePage from "./views/SubscribePage";
import AccountPage from "./views/AccountPage";
import PublicProfilePage from "./views/PublicProfilePage";
import AdminSubscriptionPage from "./views/AdminSubscriptionPage";
import EventDetail from "./views/EventDetail";
import AdminBrowseUsers from "./views/AdminBrowseUsers";
import AdminBrowseEvent from "./views/AdminBrowseEvent";
import AdminBrowseReviews from "./views/AdminBrowseReviews";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/events" element={<EventsPage />} />
        <Route path="/account" element={<AccountPage />} />
        
        <Route path="/organizer/:organizerId" element={<PublicProfilePage />} />
        <Route path="/premium" element={<SubscribePage />} />

        <Route path="/admin/subscription" element={<AdminSubscriptionPage />} />
        <Route path="/admin/browseUsers" element={<AdminBrowseUsers></AdminBrowseUsers>} />
        <Route path="/admin/browseEvents/:accountId" element={<AdminBrowseEvent></AdminBrowseEvent>} />
        <Route path="/admin/browseReviews/:accountId" element={<AdminBrowseReviews></AdminBrowseReviews>} />
                
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/event" element={< EventDetail />} />

      </Routes>
    </BrowserRouter>
  );
}
