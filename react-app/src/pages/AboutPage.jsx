import { useNavigate } from 'react-router-dom';
import BackgroundGlobes from '../components/BackgroundGlobes';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .about-page {
          height: 100dvh;
          max-height: 100dvh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(0.5rem, 2vh, 1rem) clamp(0.75rem, 3vw, 1.25rem);
          box-sizing: border-box;
          position: relative;
          width: 100%;
        }

        .about-container {
          width: 100%;
          max-width: min(540px, 94vw);
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .about-topbar {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 0.15rem;
        }

        .about-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #23212C;
          text-decoration: none;
          padding: 0.45rem 1rem;
          border-radius: 50px;
          background: #FFFFFF;
          border: 1.5px solid rgba(35, 33, 44, 0.15);
          font-weight: 700;
          font-size: 0.8rem;
          transition: all 0.25s ease;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(35, 33, 44, 0.05);
        }

        .about-back-btn:hover {
          background: #C41E3A;
          color: #FFFFFF;
          border-color: #C41E3A;
          transform: translateX(-2px);
        }

        .about-main-card {
          background: #FFFFFF;
          border: 1.5px solid rgba(35, 33, 44, 0.12);
          border-radius: 20px;
          padding: clamp(1rem, 3vw, 1.4rem);
          box-shadow: 0 16px 48px rgba(35, 33, 44, 0.08);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        /* App Branding Header */
        .about-app-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(35, 33, 44, 0.1);
        }

        .about-app-logo {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(196, 30, 58, 0.12), rgba(150, 14, 38, 0.06));
          border: 1.5px solid rgba(196, 30, 58, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .about-app-logo img {
          width: 38px;
          height: 38px;
          object-fit: contain;
        }

        .about-app-info {
          flex: 1;
          min-width: 0;
        }

        .about-app-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: #23212C;
          margin: 0 0 0.15rem 0;
          line-height: 1.2;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .about-app-version {
          font-size: 0.65rem;
          font-weight: 800;
          color: #C41E3A;
          background: rgba(196, 30, 58, 0.08);
          border: 1px solid rgba(196, 30, 58, 0.25);
          padding: 0.15rem 0.5rem;
          border-radius: 50px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .about-app-subtitle {
          font-size: 0.8rem;
          color: rgba(35, 33, 44, 0.65);
          font-weight: 600;
          margin: 0;
        }

        /* Section Headings */
        .about-section-heading {
          font-size: 0.68rem;
          font-weight: 800;
          color: #C41E3A;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.4rem;
        }

        /* Feature Cards Grid */
        .about-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .about-feature-card {
          background: #F8F6F2;
          border: 1px solid rgba(35, 33, 44, 0.1);
          border-radius: 12px;
          padding: 0.6rem 0.4rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          transition: all 0.25s ease;
        }

        .about-feature-card:hover {
          background: #FFFFFF;
          border-color: rgba(196, 30, 58, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(196, 30, 58, 0.08);
        }

        .about-feature-card i {
          font-size: 1.1rem;
          color: #C41E3A;
        }

        .about-feature-card span {
          font-size: 0.72rem;
          font-weight: 700;
          color: #23212C;
          line-height: 1.25;
        }

        /* Developer Card */
        .about-dev-box {
          background: #F8F6F2;
          border: 1px solid rgba(35, 33, 44, 0.1);
          border-radius: 14px;
          padding: 0.65rem 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .about-dev-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .about-dev-name {
          font-size: 0.95rem;
          font-weight: 900;
          color: #23212C;
          letter-spacing: 0.2px;
        }

        .about-dev-role {
          font-size: 0.7rem;
          color: rgba(35, 33, 44, 0.65);
          font-weight: 600;
        }

        .about-social-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .about-social-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1.5px solid rgba(35, 33, 44, 0.15);
          color: #C41E3A;
          text-decoration: none;
          font-size: 1.15rem;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 10px rgba(35, 33, 44, 0.05);
        }

        .about-social-icon-btn:hover {
          background: #C41E3A;
          color: #FFFFFF;
          border-color: #C41E3A;
          transform: translateY(-2px) scale(1.08);
          box-shadow: 0 6px 16px rgba(196, 30, 58, 0.25);
        }

        /* Disclaimer Footer */
        .about-disclaimer {
          background: rgba(35, 33, 44, 0.03);
          border: 1px dashed rgba(35, 33, 44, 0.18);
          border-radius: 12px;
          padding: 0.55rem 0.75rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .about-disclaimer i {
          color: #C41E3A;
          font-size: 0.85rem;
          margin-top: 0.1rem;
          flex-shrink: 0;
        }

        .about-disclaimer p {
          font-size: 0.68rem;
          line-height: 1.45;
          color: rgba(35, 33, 44, 0.7);
          font-weight: 500;
          margin: 0;
        }
      `}</style>

      <div className="about-page">
        <BackgroundGlobes />

        <div className="about-container">
          {/* Top Bar */}
          <div className="about-topbar">
            <a
              href="/"
              className="about-back-btn"
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
            </a>
          </div>

          {/* Main Card */}
          <div className="about-main-card">
            {/* App Header */}
            <div className="about-app-header">
              <div className="about-app-logo">
                <img src="/LOGO.png" alt="App Logo" />
              </div>
              <div className="about-app-info">
                <h1 className="about-app-title">
                  Course Grade Calc
                  <span className="about-app-version">v1.0</span>
                </h1>
                <p className="about-app-subtitle">
                  Universal Course Grading &amp; Target Tracking System
                </p>
              </div>
            </div>

            {/* Features Section */}
            <div>
              <div className="about-section-heading">
                <i className="fa-solid fa-layer-group"></i> Key Capabilities
              </div>
              <div className="about-features-grid">
                <div className="about-feature-card">
                  <i className="fa-solid fa-sliders"></i>
                  <span>Custom Weightages</span>
                </div>
                <div className="about-feature-card">
                  <i className="fa-solid fa-chart-line"></i>
                  <span>Grade Target Tracker</span>
                </div>
                <div className="about-feature-card">
                  <i className="fa-solid fa-trophy"></i>
                  <span>CGPA &amp; Multi-Term</span>
                </div>
              </div>
            </div>

            {/* Developer Section */}
            <div>
              <div className="about-section-heading">
                <i className="fa-solid fa-code"></i> Developer &amp; Creator
              </div>
              <div className="about-dev-box">
                <div className="about-dev-info">
                  <span className="about-dev-name">K. M. Fathum Mubin Sachcha</span>
                  <span className="about-dev-role">Software Developer</span>
                </div>
                <div className="about-social-buttons">
                  <a
                    href="https://www.linkedin.com/in/mubin25s/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-social-icon-btn"
                    title="LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                  <a
                    href="https://github.com/mubin25s"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-social-icon-btn"
                    title="GitHub"
                  >
                    <i className="fa-brands fa-github"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Disclaimer Section */}
            <div className="about-disclaimer">
              <i className="fa-solid fa-shield-halved"></i>
              <p>
                This is an independent student resource and is not officially affiliated with or endorsed by any university. Grading metrics are based on publicly available academic guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
