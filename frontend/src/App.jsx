import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { useContext } from 'react';
import AuthContext from './contexts/AuthProvider';
import { Layout } from './pages/Layout';
import { Dashboard } from './pages/Dashboard';
import { MyProfile } from './pages/MyProfile';
import { UserList } from './pages/UserList';
import { AuditLogs } from './pages/AuditLogs';
import { LandingPage } from './pages/LandingPage';
import { Loading } from './components/Loading';
import NotFound from './pages/NotFound';
import { UploadDocuments } from './pages/UploadDocuments';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? children : <Navigate to="/landing-page" state={{ from: location }} replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? children : <Navigate to="/landing-page" replace />;
};


const App = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading styles={'bg-black'} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing-page" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/landing-page"} />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><MyProfile /></RequireAuth>} />
          <Route path="/upload-documents" element={<RequireAuth><UploadDocuments /></RequireAuth>} />
          <Route path="/user-list" element={<RequireAuth><AdminRoute><UserList /></AdminRoute></RequireAuth>} />
          <Route path="/audit-logs" element={<RequireAuth><AdminRoute><AuditLogs /></AdminRoute></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
