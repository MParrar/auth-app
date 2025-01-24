import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Layout } from "./pages/Layout";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Home } from "./pages/Home";
import AuthContext, { AuthProvider } from "./contexts/AuthProvider";
import { useContext } from "react";
import { MyProfile } from "./pages/MyProfile";
import { UserList } from "./pages/UserList";
import { NotificationProvider } from "./contexts/NotificationProvider";
import { AuditLogs } from "./pages/AuditLogs";
import { Loading } from "./components/Loading";

const App = () => {
  const ProtectedRoute = ({ children }) => {
    const { token, isLoading } = useContext(AuthContext);

    if (isLoading) {
      return <Loading />;
    }

    if (!token) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const AdminRoute = ({ children }) => {
    const { user, token, isLoading } = useContext(AuthContext);

    if (isLoading || !user || Object.keys(user).length === 0) {
      return <Loading />;
    }
    if (!token) {
      return <Navigate to="/login" />;
    }
    if (user.role !== "admin") {
      return <Navigate to="/home" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Navigate to={localStorage.getItem("token") ? "/home" : "/login"} />
              }
            />
            <Route path="/login" element={<LoginGuard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route
                path="/user-list"
                element={
                  <AdminRoute>
                    <UserList />
                  </AdminRoute>
                }
              />
              <Route
                path="/audit-logs"
                element={
                  <AdminRoute>
                    <AuditLogs />
                  </AdminRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};
const LoginGuard = () => {
  const { token } = useContext(AuthContext);

  if (token) {
    return <Navigate to="/home" />;
  }
  return <Login />;
};

export default App;
