import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import JoinRoom from "./JoinRoom";   // ✔ correct path
import Room from "./Room";           // ✔ correct path

import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<JoinRoom />} />
      <Route path="/room/:id" element={<Room />} />
    </Routes>
  </BrowserRouter>
);
