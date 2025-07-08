import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {

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
