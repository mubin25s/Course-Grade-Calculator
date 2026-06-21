import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import CalculatorPage from './pages/CalculatorPage';
import AboutPage from './pages/AboutPage';
import CGPAPage from './pages/CGPAPage';
import CGPAResultPage from './pages/CGPAResultPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cgpa" element={<CGPAPage />} />
          <Route path="/cgpa-result" element={<CGPAResultPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
