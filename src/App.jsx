import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import { ApiProvider } from './hooks/useApi';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RoutesPage from './pages/RoutesPage';
import HallInfoPage from './pages/HallInfoPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <ToastProvider>
      <ApiProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/routen"
              element={
                <PrivateRoute>
                  <RoutesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/hallen-info"
              element={
                <PrivateRoute>
                  <HallInfoPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/auswertung"
              element={
                <PrivateRoute>
                  <AnalyticsPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ApiProvider>
    </ToastProvider>
  );
}

export default App;
