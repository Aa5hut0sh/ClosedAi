import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MusicProvider } from "./context/MusicContext";  

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MusicProvider>     
        <AuthProvider>    
          <App />         
        </AuthProvider>
      </MusicProvider>
    </BrowserRouter>
  </StrictMode>
);
