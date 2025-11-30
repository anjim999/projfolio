// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HistoryPage from "./pages/HistoryPage";
import StudentDashboard from "./pages/StudentDashboard";
import GenerateSuggestionsPage from "./pages/GenerateSuggestionsPage";
import SubmitProjectPage from "./pages/SubmitProjectPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminUserDetailsPage from "./pages/AdminUserDetailsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={1500} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="pt-16">
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
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users/:userId"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUserDetailsPage />
                </ProtectedRoute>
              }
            />

            {/* <Route
              path="/admin/submissions"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSubmissionsPage />
                </ProtectedRoute>
              }
            /> */}
<Route
  path="/history"
  element={
    <ProtectedRoute>
      <HistoryPage />
    </ProtectedRoute>
  }
/>


            <Route path="*" element={<LoginPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;