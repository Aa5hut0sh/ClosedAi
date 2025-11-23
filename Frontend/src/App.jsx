import { Routes, Route, Navigate } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { LandingPage } from "./pages/LandingPage";
import { Resources } from "./pages/Resources";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Journal } from "./pages/Journal";
import { FindHelp } from "./pages/FindHelp";
import { BookSession } from "./pages/BookSession";
import { SOS } from "./pages/Sos";
import { Community } from "./pages/Community";
import MusicControl from "./components/MusicControl";
import {AIChatbot} from "./pages/Chatbot";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return user ? children : <Navigate to="/signin" replace />;
};

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/findhelp"
          element={
            <ProtectedRoute>
              <FindHelp />
            </ProtectedRoute>
          }
        />

        <Route
          path="/counseling"
          element={
            <ProtectedRoute>
              <BookSession />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sos"
          element={
            <ProtectedRoute>
              <SOS />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <AIChatbot />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <MusicControl />
    </>
  );
}

export default App;
