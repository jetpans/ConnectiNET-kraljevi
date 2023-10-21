import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./views/HomePage";
import OtherPage from "./views/OtherPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/other" element={<OtherPage />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
