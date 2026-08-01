import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import AppLoader from './components/AppLoader';
import PageTransition from './components/PageTransition';

import DashboardPage  from './pages/DashboardPage';
import CalculatorPage from './pages/CalculatorPage';
import AboutPage      from './pages/AboutPage';
import CGPAPage       from './pages/CGPAPage';
import CGPAResultPage from './pages/CGPAResultPage';
import AuthPage       from './pages/AuthPage';
import ProfilePage    from './pages/ProfilePage';

// Inner component so it can use useAuth hook (must be inside AuthProvider)
function AppRoutes() {
  const { loading } = useAuth();

  // Show branded splash while Firebase resolves auth state (usually < 1 second)
  if (loading) return <AppLoader />;

  return (
    <PageTransition>
      <Routes>
        <Route path="/"            element={<DashboardPage />} />
        <Route path="/calculator"  element={<CalculatorPage />} />
        <Route path="/about"       element={<AboutPage />} />
        <Route path="/cgpa"        element={<CGPAPage />} />
        <Route path="/cgpa-result" element={<CGPAResultPage />} />
        <Route path="/auth"        element={<AuthPage />} />
        <Route path="/profile"     element={<ProfilePage />} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
