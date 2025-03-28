import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
function App() {
  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
