import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CalculatorPage from './pages/CalculatorPage';
import AboutPage from './pages/AboutPage';
import CGPAPage from './pages/CGPAPage';
import CGPAResultPage from './pages/CGPAResultPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cgpa" element={<CGPAPage />} />
        <Route path="/cgpa-result" element={<CGPAResultPage />} />
      </Routes>
    </Router>
  );
}
