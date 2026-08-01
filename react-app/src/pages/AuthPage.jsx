import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Toast from '../components/Toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle, loginWithGithub } = useAuth();

  const [loadingProvider, setLoadingProvider] = useState(null); // 'google' | 'github' | null
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const isPendingSave = searchParams.get('redirect') === 'save-pending';

  const showToast = (m, t = 'success') => setToast({ message: m, type: t });

  const handleGoogle = async () => {
    setFormError('');
    setLoadingProvider('google');
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        showToast('Signed in with Gmail!');
        setTimeout(() => navigate('/profile'), 1200);
      } else {
        setLoadingProvider(null);
        if (res.error?.code === 'auth/popup-closed-by-user') {
          setFormError('Sign-in cancelled by user.');
        } else {
          setFormError(res.error?.message || 'Gmail sign-in failed. Please try again.');
        }
      }
    } catch {
      setLoadingProvider(null);
      setFormError('Unexpected error during Gmail sign-in.');
    }
  };

  const handleGithub = async () => {
    setFormError('');
    setLoadingProvider('github');
    try {
      const res = await loginWithGithub();
      if (res.success) {
        showToast('Signed in with GitHub!');
        setTimeout(() => navigate('/profile'), 1200);
      } else {
        setLoadingProvider(null);
        if (res.error?.code === 'auth/popup-closed-by-user') {
          setFormError('Sign-in cancelled by user.');
        } else if (res.error?.code === 'auth/account-exists-with-different-credential') {
          setFormError('An account already exists with the same email using a different sign-in method.');
        } else {
          setFormError(res.error?.message || 'GitHub sign-in failed. Please try again.');
        }
      }
    } catch {
      setLoadingProvider(null);
      setFormError('Unexpected error during GitHub sign-in.');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body, #root {
          height: 100% !important;
          overflow: hidden !important;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.05); }
        }

        .aw-root {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: #FAF8F5;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          overflow: hidden;
        }

        /* Ambient glowing background elements */
        .aw-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(100px);
          animation: pulseGlow 8s ease-in-out infinite;
        }
        .aw-glow-1 {
          width: 600px;
          height: 600px;
          top: -180px;
          right: -120px;
          background: radial-gradient(circle, rgba(196,30,58,0.14) 0%, transparent 70%);
        }
        .aw-glow-2 {
          width: 500px;
          height: 500px;
          bottom: -150px;
          left: -100px;
          background: radial-gradient(circle, rgba(35,33,44,0.08) 0%, transparent 70%);
        }
        .aw-glow-3 {
          width: 350px;
          height: 350px;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(196,30,58,0.06) 0%, transparent 70%);
        }

        /* Back Button */
        .aw-back {
          position: absolute;
          top: 1.75rem;
          left: 1.75rem;
          z-index: 100;
          background: #FFFFFF;
          border: 1px solid rgba(35, 33, 44, 0.15);
          color: #23212C;
          padding: 0.55rem 1.25rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 15px rgba(35, 33, 44, 0.06);
          transition: all 0.22s ease;
          font-family: 'Inter', sans-serif;
        }
        .aw-back:hover {
          color: #C41E3A;
          background: #FFFFFF;
          border-color: #C41E3A;
          transform: translateX(-2px);
        }

        /* Card Container */
        .aw-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          background: #FFFFFF;
          border: 1px solid rgba(35, 33, 44, 0.12);
          border-radius: 24px;
          padding: 2.75rem 2.25rem;
          box-shadow: 0 20px 60px rgba(35, 33, 44, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
          animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          text-align: center;
        }

        .aw-logo-badge {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(196,30,58,0.12) 0%, rgba(150,14,38,0.2) 100%);
          border: 1px solid rgba(196,30,58,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(196,30,58,0.15);
        }

        .aw-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 2.5px;
          color: #C41E3A;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
        }
        .aw-eyebrow-line {
          width: 16px;
          height: 2px;
          background: #C41E3A;
          border-radius: 2px;
        }

        .aw-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: #23212C;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 0.6rem;
          text-transform: uppercase;
        }
        .aw-title-accent {
          color: #C41E3A;
        }

        .aw-subtitle {
          font-size: 0.88rem;
          color: rgba(35, 33, 44, 0.7);
          line-height: 1.55;
          margin-bottom: 2.2rem;
        }

        /* Error Box */
        .aw-error {
          background: rgba(196, 30, 58, 0.08);
          border: 1px solid rgba(196, 30, 58, 0.3);
          border-radius: 12px;
          padding: 0.85rem 1rem;
          color: #C41E3A;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        /* Auth Buttons Stack */
        .aw-btn-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .aw-auth-btn {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.92rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: 'Inter', sans-serif;
          position: relative;
          outline: none;
        }
        .aw-auth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Gmail / Google Button */
        .aw-btn-gmail {
          background: #C41E3A;
          border: 1px solid #C41E3A;
          color: #FFFFFF;
          box-shadow: 0 6px 20px rgba(196, 30, 58, 0.25);
        }
        .aw-btn-gmail:hover:not(:disabled) {
          background: #A50020;
          border-color: #A50020;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(196, 30, 58, 0.38);
        }

        /* GitHub Button */
        .aw-btn-github {
          background: #23212C;
          border: 1.5px solid #23212C;
          color: #FFFFFF;
          box-shadow: 0 6px 20px rgba(35, 33, 44, 0.15);
        }
        .aw-btn-github:hover:not(:disabled) {
          background: #191820;
          border-color: #C41E3A;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(35, 33, 44, 0.28);
        }

        .aw-footer-note {
          margin-top: 2.2rem;
          font-size: 0.74rem;
          color: rgba(35, 33, 44, 0.5);
          line-height: 1.5;
        }
      `}</style>

      <div className="aw-root">
        <div className="aw-glow aw-glow-1"></div>
        <div className="aw-glow aw-glow-2"></div>
        <div className="aw-glow aw-glow-3"></div>

        <button className="aw-back" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        <div className="aw-card">
          <div className="aw-logo-badge">
            <img
              src="/LOGO.png"
              alt="Logo"
              style={{ width: 36, height: 36, objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
              }}
            />
            <i className="fa-solid fa-graduation-cap" style={{ color: '#C41E3A', fontSize: '1.4rem', display: 'none' }}></i>
          </div>

          <div className="aw-eyebrow">
            <span className="aw-eyebrow-line"></span>
            {isPendingSave ? 'Save Your Record' : 'Authentication'}
            <span className="aw-eyebrow-line"></span>
          </div>

          <h1 className="aw-title">
            Sign <span className="aw-title-accent">In.</span>
          </h1>
          <p className="aw-subtitle">
            {isPendingSave
              ? 'Log in with Gmail or GitHub to save your CGPA record to the cloud.'
              : 'Choose your preferred sign-in method to access your grade dashboard.'}
          </p>

          {formError && (
            <div className="aw-error">
              <i className="fa-solid fa-circle-exclamation" style={{ flexShrink: 0 }}></i>
              <span>{formError}</span>
            </div>
          )}

          <div className="aw-btn-stack">
            <button
              type="button"
              className="aw-auth-btn aw-btn-gmail"
              onClick={handleGoogle}
              disabled={!!loadingProvider}
            >
              {loadingProvider === 'google' ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Signing in with Gmail...
                </>
              ) : (
                <>
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google Logo"
                    style={{ width: 20, height: 20, background: '#fff', borderRadius: '50%', padding: '2px' }}
                  />
                  <span>Continue with Gmail</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="aw-auth-btn aw-btn-github"
              onClick={handleGithub}
              disabled={!!loadingProvider}
            >
              {loadingProvider === 'github' ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Signing in with GitHub...
                </>
              ) : (
                <>
                  <i className="fa-brands fa-github" style={{ fontSize: '1.25rem' }}></i>
                  <span>Continue with GitHub</span>
                </>
              )}
            </button>
          </div>

          <p className="aw-footer-note">
            By signing in, you agree to store your academic records securely in Cloud Firestore.
          </p>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: 'success' })} />
    </>
  );
}
