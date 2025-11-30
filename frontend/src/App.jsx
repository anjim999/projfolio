// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import StudentDashboard from "./pages/StudentDashboard";
import GenerateSuggestionsPage from "./pages/GenerateSuggestionsPage";
import SubmitProjectPage from "./pages/SubmitProjectPage";

import AdminSubmissionsPage from "./pages/AdminSubmissionsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter> 
      <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/suggestions/new"
            element={
              <ProtectedRoute>
                <GenerateSuggestionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submit/:suggestionId"
            element={
              <ProtectedRoute>
                <SubmitProjectPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminSubmissionsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
