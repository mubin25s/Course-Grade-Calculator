import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, loginWithGoogle, setupRecaptcha, loginWithPhone } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isAnimating, setIsAnimating] = useState(false);

  const isPendingSave = searchParams.get('redirect') === 'save-pending';

  useEffect(() => {
    if (authMethod === 'phone' && !window.recaptchaVerifier) {
      setupRecaptcha('recaptcha-container');
    }
  }, [authMethod, setupRecaptcha]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) { setFormError('Please fill in all fields.'); return; }
    if (!isLogin && password !== confirmPassword) { setFormError('Passwords do not match.'); return; }
    if (password.length < 6) { setFormError('Password must be at least 6 characters long.'); return; }
    setLoading(true);
    try {
      const res = isLogin ? await login(trimmedEmail, password) : await register(trimmedEmail, password);
      if (res.success) {
        const justSaved = sessionStorage.getItem('justSavedPending');
        if (justSaved) { sessionStorage.removeItem('justSavedPending'); showToast('Account verified & record saved!', 'success'); }
        else showToast(isLogin ? 'Logged in successfully!' : 'Registration successful!', 'success');
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        setLoading(false);
        let msg = 'An error occurred. Please try again.';
        if (res.error?.code === 'auth/email-already-in-use') msg = 'This email is already in use.';
        else if (res.error?.code === 'auth/invalid-credential') msg = 'Incorrect email or password.';
        else if (res.error?.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
        else if (res.error?.message) msg = res.error.message;
        setFormError(msg);
      }
    } catch (err) { setLoading(false); setFormError('An unexpected error occurred.'); console.error(err); }
  };

  const handleGoogleLogin = async () => {
    setFormError(''); setLoading(true);
    const res = await loginWithGoogle();
    if (res.success) { showToast('Logged in with Google!', 'success'); setTimeout(() => navigate('/profile'), 1500); }
    else { setLoading(false); setFormError('Google Sign-In failed or was cancelled.'); }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault(); setFormError('');
    if (!phoneNumber) { setFormError('Please enter a phone number with country code.'); return; }
    setLoading(true);
    const res = await loginWithPhone(phoneNumber, window.recaptchaVerifier);
    setLoading(false);
    if (res.success) { setConfirmationResult(res.confirmationResult); setShowOtpInput(true); showToast('OTP sent!', 'success'); }
    else setFormError(res.error?.message || 'Failed to send OTP.');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); setFormError('');
    if (!otp) { setFormError('Please enter the OTP.'); return; }
    setLoading(true);
    try { await confirmationResult.confirm(otp); showToast('Phone verified!', 'success'); setTimeout(() => navigate('/profile'), 1500); }
    catch { setLoading(false); setFormError('Invalid OTP code.'); }
  };

  const toggleMode = (loginMode) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => { setIsLogin(loginMode); setFormError(''); setPassword(''); setConfirmPassword(''); setAuthMethod('email'); setIsAnimating(false); }, 350);
  };

  const switchAuthMethod = (method) => {
    setAuthMethod(method); setFormError(''); setShowOtpInput(false); setOtp('');
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '14px', padding: '0.85rem 1rem 0.85rem 2.75rem',
    color: '#fff', fontSize: '0.92rem', outline: 'none',
    transition: 'all 0.2s ease', fontFamily: 'inherit',
  };

  const InputField = ({ icon, label, type, placeholder, value, onChange, rightSlot, id }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '0.45rem' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <i className={icon} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}></i>
        <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} required style={inputStyle}
          onFocus={e => { e.target.style.borderColor = 'rgba(165,29,58,0.8)'; e.target.style.background = 'rgba(255,255,255,0.09)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
        />
        {rightSlot && <div style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}>{rightSlot}</div>}
      </div>
    </div>
  );

  const EyeToggle = () => (
    <button type="button" onClick={() => setShowPassword(!showPassword)}
      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px', fontSize: '0.85rem' }}>
      <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
    </button>
  );

  const SubmitBtn = ({ text, loadingText }) => (
    <button type="submit" disabled={loading} style={{
      width: '100%', padding: '0.95rem', marginTop: '0.5rem',
      background: loading ? 'rgba(109,0,26,0.5)' : 'linear-gradient(135deg, #8B0020 0%, #A51D3A 50%, #C0392B 100%)',
      border: 'none', borderRadius: '14px', color: '#fff',
      fontWeight: 800, fontSize: '0.88rem', letterSpacing: '1.5px', textTransform: 'uppercase',
      cursor: loading ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
      boxShadow: loading ? 'none' : '0 8px 32px rgba(109,0,26,0.45)',
      transition: 'all 0.25s ease', fontFamily: 'inherit',
    }}
      onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 40px rgba(109,0,26,0.6)'; } }}
      onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = loading ? 'none' : '0 8px 32px rgba(109,0,26,0.45)'; }}>
      {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> {loadingText}</> : text}
    </button>
  );

  const Divider = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0', color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '1.5px', fontWeight: 600, textTransform: 'uppercase' }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }}></div>
      {text}
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }}></div>
    </div>
  );

  const ErrorBox = () => formError ? (
    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '12px', padding: '0.7rem 0.9rem', color: '#fc8585', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
      <i className="fa-solid fa-circle-exclamation" style={{ flexShrink: 0 }}></i><span>{formError}</span>
    </div>
  ) : null;

  const EmailForm = () => (
    <form onSubmit={handleSubmit}>
      <ErrorBox />
      <InputField id="auth-email" icon="fa-solid fa-envelope" label="Email Address" type="email" placeholder="name@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
      <InputField id="auth-password" icon="fa-solid fa-lock" label="Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} rightSlot={<EyeToggle />} />
      {!isLogin && <InputField id="auth-confirm" icon="fa-solid fa-shield-halved" label="Confirm Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />}
      <SubmitBtn text={isLogin ? 'Sign In' : 'Create Account'} loadingText={isLogin ? 'Signing In…' : 'Creating…'} />
    </form>
  );

  const PhoneForm = () => (
    <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: '0.85rem' }}>Phone Sign In</span>
        <button type="button" onClick={() => switchAuthMethod('email')} style={{ background: 'none', border: 'none', color: '#A51D3A', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>← Use Email</button>
      </div>
      <ErrorBox />
      {!showOtpInput ? (
        <>
          <InputField id="auth-phone" icon="fa-solid fa-phone" label="Phone Number (with country code)" type="tel" placeholder="+8801XXXXXXXXX" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
          <div id="recaptcha-container"></div>
          <SubmitBtn text="Send OTP" loadingText="Sending…" />
        </>
      ) : (
        <>
          <InputField id="auth-otp" icon="fa-solid fa-key" label="Enter OTP Code" type="text" placeholder="1 2 3 4 5 6" value={otp} onChange={e => setOtp(e.target.value)} />
          <SubmitBtn text="Verify & Continue" loadingText="Verifying…" />
        </>
      )}
    </form>
  );

  const SocialButtons = () => (
    <>
      <Divider text="Or continue with" />
      <button type="button" onClick={handleGoogleLogin} disabled={loading} style={{
        width: '100%', padding: '0.85rem', background: '#fff', border: 'none', borderRadius: '14px',
        fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '0.65rem', color: '#1a1a1a', marginBottom: '0.65rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'all 0.2s ease', fontFamily: 'inherit',
      }}
        onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}>
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 18, height: 18 }} />
        Continue with Google
      </button>
      <button type="button" onClick={() => switchAuthMethod('phone')} disabled={loading} style={{
        width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.09)',
        borderRadius: '14px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', color: 'rgba(255,255,255,0.7)',
        transition: 'all 0.2s ease', fontFamily: 'inherit',
      }}>
        <i className="fa-solid fa-mobile-screen-button"></i> Continue with Phone
      </button>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }

        .auth-root {
          min-height: 100vh;
          background: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          padding: 1rem;
          position: relative;
          overflow: hidden;
        }

        /* Background ambient glow */
        .auth-root::before {
          content: '';
          position: fixed;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(109,0,26,0.18) 0%, transparent 70%);
          top: -150px; right: -150px;
          pointer-events: none; z-index: 0;
          animation: glowPulse 6s ease-in-out infinite alternate;
        }
        .auth-root::after {
          content: '';
          position: fixed;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(109,0,26,0.1) 0%, transparent 70%);
          bottom: -100px; left: -100px;
          pointer-events: none; z-index: 0;
          animation: glowPulse 8s ease-in-out infinite alternate-reverse;
        }

        @keyframes glowPulse {
          0% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.1); }
        }

        .auth-back {
          position: fixed; top: 1.25rem; left: 1.25rem; z-index: 200;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.55); padding: 0.5rem 1.1rem; border-radius: 50px;
          font-size: 0.78rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 0.4rem;
          transition: all 0.2s; font-family: 'Inter', sans-serif;
          letter-spacing: 0.5px;
        }
        .auth-back:hover { color: #fff; background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.15); }

        /* ===== DESKTOP LAYOUT ===== */
        .auth-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 920px; min-height: 600px;
          display: flex; border-radius: 32px; overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05);
        }

        /* Form panel (always visible, left side on desktop) */
        .auth-form-side {
          flex: 1;
          background: #0c0c0c;
          padding: 3.5rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          min-width: 0;
          border-right: 1px solid rgba(255,255,255,0.04);
        }

        /* Sliding accent panel (right side on desktop) */
        .auth-panel {
          width: 42%;
          background: linear-gradient(160deg, #7A0020 0%, #A01830 40%, #C03040 75%, #8B1A2A 100%);
          position: absolute; top: 0; right: 0; height: 100%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 3rem 2.5rem; text-align: center;
          z-index: 10; border-radius: 0 32px 32px 0;
          transition: transform 0.7s cubic-bezier(0.77, 0, 0.175, 1);
          overflow: hidden;
        }
        /* Decorative circles on panel */
        .auth-panel::before {
          content: ''; position: absolute;
          width: 300px; height: 300px; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.07);
          top: -80px; left: -80px; pointer-events: none;
        }
        .auth-panel::after {
          content: ''; position: absolute;
          width: 200px; height: 200px; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.06);
          bottom: -60px; right: -60px; pointer-events: none;
        }

        .auth-panel.is-login   { transform: translateX(0%);    border-radius: 0 32px 32px 0; }
        .auth-panel.is-register { transform: translateX(-138%); border-radius: 32px 0 0 32px; }

        .panel-logo {
          width: 72px; height: 72px; border-radius: 20px; object-fit: contain;
          margin-bottom: 1.75rem; position: relative; z-index: 1;
          filter: drop-shadow(0 8px 24px rgba(0,0,0,0.4));
        }
        .panel-logo-fallback {
          width: 72px; height: 72px; border-radius: 20px;
          background: rgba(255,255,255,0.12); margin-bottom: 1.75rem;
          display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;
        }
        .panel-title {
          font-size: 2.2rem; font-weight: 900; color: #fff;
          letter-spacing: -1px; line-height: 1.05;
          margin-bottom: 1rem; text-transform: uppercase;
          position: relative; z-index: 1;
        }
        .panel-title span { display: block; color: rgba(255,255,255,0.6); font-size: 1.4rem; font-weight: 600; text-transform: none; letter-spacing: 0; margin-top: 0.15rem; }
        .panel-sub {
          font-size: 0.85rem; color: rgba(255,255,255,0.65); line-height: 1.7;
          margin-bottom: 2.5rem; max-width: 210px; position: relative; z-index: 1;
        }
        .panel-cta {
          background: transparent; border: 2px solid rgba(255,255,255,0.7);
          color: #fff; padding: 0.8rem 2.25rem; border-radius: 50px;
          font-weight: 800; font-size: 0.82rem; cursor: pointer;
          letter-spacing: 2px; text-transform: uppercase;
          transition: all 0.25s ease; font-family: 'Inter', sans-serif;
          position: relative; z-index: 1;
        }
        .panel-cta:hover { background: rgba(255,255,255,0.15); border-color: #fff; transform: translateY(-1px); }

        /* Form content animation */
        .form-slide-in {
          animation: formSlide 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .form-slide-out {
          animation: formSlideOut 0.35s ease forwards;
        }
        @keyframes formSlide {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes formSlideOut {
          to { opacity: 0; transform: translateX(-18px); }
        }

        .form-title {
          font-size: 2.1rem; font-weight: 900; color: #fff;
          letter-spacing: -1px; margin-bottom: 0.2rem;
          text-transform: uppercase;
        }
        .form-title span { color: #A51D3A; }
        .form-sub {
          font-size: 0.82rem; color: rgba(255,255,255,0.35);
          margin-bottom: 2rem; line-height: 1.5;
        }

        /* ===== MOBILE LAYOUT ===== */
        @media (max-width: 700px) {
          .auth-root { padding: 0; align-items: stretch; }
          .auth-card {
            flex-direction: column; border-radius: 0; min-height: 100vh;
            max-width: 100%; box-shadow: none;
          }
          .auth-panel {
            position: relative; width: 100%; height: auto;
            transform: none !important;
            border-radius: 0 0 32px 32px !important;
            padding: 2.5rem 2rem 3rem;
            order: -1; flex-direction: row; gap: 1.25rem; text-align: left;
            justify-content: flex-start; align-items: center;
            min-height: 160px;
          }
          .auth-panel::before, .auth-panel::after { display: none; }
          .panel-logo { width: 52px; height: 52px; margin-bottom: 0; flex-shrink: 0; }
          .panel-logo-fallback { width: 52px; height: 52px; margin-bottom: 0; flex-shrink: 0; }
          .panel-title { font-size: 1.5rem; margin-bottom: 0.3rem; }
          .panel-title span { font-size: 0.9rem; margin-top: 0.1rem; }
          .panel-sub { margin-bottom: 0; display: none; }
          .panel-cta { display: none; }
          .auth-form-side { padding: 2rem 1.5rem 2.5rem; border-right: none; border-radius: 0; }
          .form-title { font-size: 1.6rem; }

          /* Mobile: show tab switcher instead */
          .mobile-tab-bar {
            display: flex;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 14px; padding: 4px;
            margin-bottom: 1.75rem;
          }
          .mobile-tab {
            flex: 1; padding: 0.65rem; border: none; border-radius: 11px;
            font-weight: 700; font-size: 0.85rem; cursor: pointer;
            transition: all 0.25s ease; font-family: 'Inter', sans-serif;
          }
          .mobile-tab.active { background: linear-gradient(135deg, #6D001A, #A51D3A); color: #fff; box-shadow: 0 4px 16px rgba(109,0,26,0.4); }
          .mobile-tab.inactive { background: transparent; color: rgba(255,255,255,0.4); }
        }

        @media (min-width: 701px) {
          .mobile-tab-bar { display: none !important; }
          .auth-panel-mobile-text { display: none !important; }
        }
      `}</style>

      <div className="auth-root">
        <button className="auth-back" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        <div className="auth-card">

          {/* ── FORM SIDE ── */}
          <div className="auth-form-side">

            {/* Mobile tab switcher */}
            <div className="mobile-tab-bar">
              <button className={`mobile-tab ${isLogin ? 'active' : 'inactive'}`} onClick={() => toggleMode(true)}>Sign In</button>
              <button className={`mobile-tab ${!isLogin ? 'active' : 'inactive'}`} onClick={() => toggleMode(false)}>Register</button>
            </div>

            <div key={isLogin ? 'login' : 'register'} className="form-slide-in">
              <div className="form-title">
                {isLogin ? <>Welcome <span>Back.</span></> : <>Create <span>Account.</span></>}
              </div>
              <p className="form-sub">
                {isPendingSave ? 'Sign in or register to save your CGPA record.' : isLogin ? 'Sign in to track your academic progress.' : 'Join to save and sync your grades.'}
              </p>

              {authMethod === 'phone' ? <PhoneForm /> : <EmailForm />}
              {authMethod === 'email' && <SocialButtons />}
            </div>
          </div>

          {/* ── SLIDING ACCENT PANEL ── */}
          <div className={`auth-panel ${isLogin ? 'is-login' : 'is-register'}`}>
            <img src="/LOGO.png" alt="Logo" className="panel-logo"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            <div className="panel-logo-fallback" style={{ display: 'none' }}>
              <i className="fa-solid fa-graduation-cap" style={{ color: '#fff', fontSize: '1.75rem' }}></i>
            </div>

            {isLogin ? (
              <>
                <div className="panel-title">New<span>to Grade Portal?</span></div>
                <p className="panel-sub">Create a free account to save your CGPA and track your academic journey semester by semester.</p>
                <button className="panel-cta" onClick={() => toggleMode(false)}>Register</button>
              </>
            ) : (
              <>
                <div className="panel-title">Already<span>have an account?</span></div>
                <p className="panel-sub">Sign back in and pick up your progress right where you left off.</p>
                <button className="panel-cta" onClick={() => toggleMode(true)}>Sign In</button>
              </>
            )}
          </div>

        </div>
      </div>

      <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: 'success' })} />
    </>
  );
}
