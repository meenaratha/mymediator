import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import { generateToken , listenToMessages } from "./notifications/firebase";
import { useEffect } from "react";
function App() {
useEffect(()=>{

  generateToken();
  listenToMessages(); // foreground notifications
 
},[]);
  return (
    <>
      <BrowserRouter
      // basename={import.meta.env.REACT_APP_BASENAME || "/mymediator"}
      >
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
