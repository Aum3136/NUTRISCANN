import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Upload from "./pages/Upload";
import History from "./pages/History";
import Diet from "./pages/Diet";
import Charts from "./pages/Charts";
import ManualEntry from "./pages/ManualEntry";
import Auth from "./pages/Auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? <Navigate to="/" replace /> : <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout><Upload /></Layout></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
      <Route path="/diet" element={<ProtectedRoute><Layout><Diet /></Layout></ProtectedRoute>} />
      <Route path="/charts" element={<ProtectedRoute><Layout><Charts /></Layout></ProtectedRoute>} />
      <Route path="/manual" element={<ProtectedRoute><Layout><ManualEntry /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;