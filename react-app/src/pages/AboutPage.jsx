import { useNavigate } from 'react-router-dom';
import BackgroundGlobes from '../components/BackgroundGlobes';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 2rem' }}>
      <BackgroundGlobes />

      <div className="dashboard-container" style={{ minHeight: 'auto' }}>
        <div className="dashboard-header" style={{ marginBottom: '1.1rem', gap: '0.5rem' }}>
          <div className="header-icon" style={{ width: 62, height: 62 }}>
            <img src="/LOGO.png" alt="Logo" style={{ width: 62, height: 62, objectFit: 'contain', display: 'block' }} />
          </div>
          <h1 className="dashboard-title" style={{ fontSize: '2.2rem', marginBottom: '0.2rem' }}>About the App</h1>
          <p className="dashboard-subtitle" style={{ fontSize: '0.95rem' }}>Universal Course Grading System</p>
        </div>

        <div className="about-card">
          <p className="about-description">
            Calculate your course grades with precision and track your academic progress
          </p>

          <div className="about-divider"></div>

          <div className="about-developer">
            <span className="label">Designed &amp; Developed by</span>
            <span className="name">K. M. Fathum Mubin Sachcha</span>
            <div className="social-links">
              <a
                href="https://www.linkedin.com/in/mubin25s/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-raw-icon"
                title="LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in" style={{ color: '#f2c4ce' }}></i>
              </a>
              <a
                href="https://github.com/mubin25s"
                target="_blank"
                rel="noopener noreferrer"
                className="social-raw-icon"
                title="GitHub"
              >
                <i className="fa-brands fa-github" style={{ color: '#f2c4ce' }}></i>
              </a>
            </div>
          </div>

          <div className="about-disclaimer-box">
            <p>
              This is an independent, unofficial student resource and is not affiliated with or endorsed by any university.
              Grading information is based on publicly available sources and may change.
            </p>
          </div>

          <button className="dashboard-btn" onClick={() => navigate('/')}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
