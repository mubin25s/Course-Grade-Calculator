import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundGlobes from '../components/BackgroundGlobes';
import SetupModal from '../components/SetupModal';
import Toast from '../components/Toast';
import { useAuth } from '../context/useAuth';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
        {/* Navigation Bar */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: '2rem',
          padding: '0.55rem 0.55rem 0.55rem 1.25rem',
          background: '#FFFFFF',
          border: '1.5px solid var(--glass-border)',
          borderRadius: '50px',
          boxShadow: '0 4px 20px rgba(35,33,44,0.06)',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 30, height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <i className="fa-solid fa-graduation-cap" style={{ color: '#fff', fontSize: '0.7rem' }}></i>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.2px' }}>
              Course Grade Portal
            </span>
          </div>

          {/* Right side */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="hide-on-mobile" style={{
                fontSize: '0.78rem', color: 'var(--text-muted)', paddingRight: '0.5rem',
                borderRight: '1.5px solid var(--glass-border)',
              }}>
                Hi, <strong style={{ color: 'var(--text-main)', fontWeight: 700 }}>{user.email.split('@')[0]}</strong>
              </span>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  background: 'rgba(196,30,58,0.07)',
                  border: '1.5px solid rgba(196,30,58,0.2)',
                  color: 'var(--primary)',
                  padding: '0.45rem 1rem',
                  borderRadius: '50px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(196,30,58,0.07)'; e.currentTarget.style.color = 'var(--primary)'; }}
              >
                <i className="fa-solid fa-circle-user"></i> Profile
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                border: 'none',
                color: '#fff',
                padding: '0.5rem 1.15rem',
                borderRadius: '50px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(196,30,58,0.25)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(196,30,58,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(196,30,58,0.25)'; }}
            >
              <i className="fa-solid fa-right-to-bracket"></i> Login / Register
            </button>
          )}
        </nav>

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
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Install Grade Calculator</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Add to your home screen for quick access</div>
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
                background: 'rgba(35,33,44,0.06)', color: 'rgba(35,33,44,0.55)',
                border: '1px solid rgba(35,33,44,0.15)', padding: '0.55rem 0.75rem',
                borderRadius: 50, fontSize: '0.85rem', cursor: 'pointer',
              }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        )}

        {/* Main Card for Calculator */}
        <div style={{ width: '100%', maxWidth: '580px', margin: '0 auto 2rem auto' }}>
          <div className="dashboard-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(196, 30, 58, 0.1)', border: '1px solid rgba(196, 30, 58, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.25rem', margin: '0 auto' }}>
              <i className="fa-solid fa-calculator"></i>
            </div>
            <h2 style={{ fontSize: '1.25rem', color: '#23212C', textAlign: 'center', fontWeight: 700 }}>Course Grade Calculator</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.5, marginBottom: '0.5rem' }}>
              Calculate grades for individual courses with custom assessment weightages (Quizzes, Midterm, Final, Attendance, Assignments).
            </p>
            <button className="dashboard-btn" onClick={() => setSetupOpen(true)} style={{ marginTop: 'auto', width: '100%', padding: '0.9rem 1.25rem', borderRadius: '14px' }}>
              <i className="fa-solid fa-sliders"></i>
              <span>Start Course Calculator</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
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
