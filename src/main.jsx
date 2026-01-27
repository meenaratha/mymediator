import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import store from "../src/redux/store"; // adjust path if needed
import { TourProvider } from "@reactour/tour";
import homeTourSteps from "./components/HomeTour.js";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      
        <TourProvider
          steps={homeTourSteps}
          showCloseButton
          showNavigation
          showBadge
          styles={{
            popover: (base) => ({
              ...base,
              borderRadius: "12px",
              padding: "16px",
            }),
          }}
        >
          <App />
        </TourProvider>
    
    </Provider>
  </React.StrictMode>,
);
