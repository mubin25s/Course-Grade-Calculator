import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundGlobes from '../components/BackgroundGlobes';
import SetupModal from '../components/SetupModal';
import Toast from '../components/Toast';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [setupOpen, setSetupOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!sessionStorage.getItem('pwa-dismissed')) setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => { setShowBanner(false); setDeferredPrompt(null); });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-dismissed', '1');
  };

  const handleLaunch = () => {
    sessionStorage.setItem('from-dashboard', '1');
    navigate('/calculator');
  };

  return (
    <div className="dashboard-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem' }}>
      <BackgroundGlobes />

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-icon">
            <img src="/LOGO.png" alt="Logo" style={{ width: 72, height: 72, objectFit: 'contain', display: 'block' }} />
          </div>
          <h1 className="dashboard-title">Universal Grade Calculator</h1>
          <p className="dashboard-subtitle">Configure your marks distribution and calculate your grades instantly</p>
        </div>

        {/* PWA Install Banner */}
        {showBanner && (
          <div id="pwa-install-banner" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
            background: 'rgba(109,0,26,0.15)', border: '1px solid rgba(109,0,26,0.35)', borderRadius: 20,
            padding: '1rem 1.25rem', marginBottom: '1.5rem', backdropFilter: 'blur(10px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src="/LOGO.png" style={{ width: 42, height: 42, borderRadius: 10 }} alt="App Icon" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Install Grade Calculator</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>Add to your home screen for quick access</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button id="pwa-install-btn" onClick={handleInstall} style={{
                background: 'linear-gradient(135deg,#6D001A,#A51D3A)', color: '#fff', border: 'none',
                padding: '0.55rem 1.1rem', borderRadius: 50, fontWeight: 700, fontSize: '0.85rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                <i className="fa-solid fa-download"></i> Install
              </button>
              <button id="pwa-dismiss-btn" onClick={handleDismiss} style={{
                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.15)', padding: '0.55rem 0.75rem',
                borderRadius: 50, fontSize: '0.85rem', cursor: 'pointer',
              }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="dashboard-card main-entry">
          <button className="dashboard-btn" onClick={() => setSetupOpen(true)}>
            <i className="fa-solid fa-sliders"></i>
            <span>Configure &amp; Start Calculator</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>

          <div className="dashboard-features">
            <div className="feature-item">
              <i className="fa-solid fa-calculator"></i>
              <span>Grade Calculator</span>
            </div>
            <div className="feature-item">
              <i className="fa-solid fa-chart-line"></i>
              <span>Grade Targets</span>
            </div>
            <div className="feature-item">
              <i className="fa-solid fa-trophy"></i>
              <span>Achievement Tracking</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <div className="about-btn-container">
            <a
              href="/about"
              className="about-btn"
              onClick={e => { e.preventDefault(); navigate('/about'); }}
            >
              <i className="fa-solid fa-circle-info"></i>
              <span>About the App</span>
            </a>
          </div>
        </div>
      </div>

      {/* Setup Modal */}
      <SetupModal
        isOpen={setupOpen}
        onClose={() => setSetupOpen(false)}
        onLaunch={handleLaunch}
      />

      <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '' })} />
    </div>
  );
}
