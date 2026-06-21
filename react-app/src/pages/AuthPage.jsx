import { useState, useEffect } from 'react';
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

  const isPendingSave = searchParams.get('redirect') === 'save-pending';

  useEffect(() => {
    if (authMethod === 'phone' && !window.recaptchaVerifier) {
      setupRecaptcha('recaptcha-container');
    }
  }, [authMethod, setupRecaptcha]);

  const showToast = (m, t = 'success') => setToast({ message: m, type: t });

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) { setFormError('Please fill in all fields.'); return; }
    if (!isLogin && password !== confirmPassword) { setFormError('Passwords do not match.'); return; }
    if (password.length < 6) { setFormError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = isLogin ? await login(trimmedEmail, password) : await register(trimmedEmail, password);
      if (res.success) {
        const justSaved = sessionStorage.getItem('justSavedPending');
        if (justSaved) { sessionStorage.removeItem('justSavedPending'); showToast('Saved & signed in!'); }
        else showToast(isLogin ? 'Logged in!' : 'Account created!');
        setTimeout(() => navigate('/profile'), 1400);
      } else {
        setLoading(false);
        let msg = 'An error occurred.';
        if (res.error?.code === 'auth/email-already-in-use') msg = 'Email already in use.';
        else if (res.error?.code === 'auth/invalid-credential') msg = 'Incorrect email or password.';
        else if (res.error?.code === 'auth/invalid-email') msg = 'Invalid email address.';
        else if (res.error?.message) msg = res.error.message;
        setFormError(msg);
      }
    } catch { setLoading(false); setFormError('Unexpected error.'); }
  };

  const handleGoogle = async () => {
    setFormError(''); setLoading(true);
    const res = await loginWithGoogle();
    if (res.success) { showToast('Signed in with Google!'); setTimeout(() => navigate('/profile'), 1400); }
    else { setLoading(false); setFormError('Google sign-in failed.'); }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault(); setFormError('');
    if (!phoneNumber) { setFormError('Enter a phone number with country code.'); return; }
    setLoading(true);
    const res = await loginWithPhone(phoneNumber, window.recaptchaVerifier);
    setLoading(false);
    if (res.success) { setConfirmationResult(res.confirmationResult); setShowOtpInput(true); showToast('OTP sent!'); }
    else setFormError(res.error?.message || 'Failed to send OTP.');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); setFormError('');
    if (!otp) { setFormError('Enter the OTP.'); return; }
    setLoading(true);
    try { await confirmationResult.confirm(otp); showToast('Phone verified!'); setTimeout(() => navigate('/profile'), 1400); }
    catch { setLoading(false); setFormError('Invalid OTP.'); }
  };

  const toggleMode = (loginMode) => {
    setIsLogin(loginMode);
    setFormError(''); setPassword(''); setConfirmPassword(''); setAuthMethod('email');
  };

  const switchMethod = (m) => { setAuthMethod(m); setFormError(''); setShowOtpInput(false); setOtp(''); };

  // ─── Shared sub-components ───────────────────────────────

  const errorBox = formError ? (
    <div style={{ background: 'rgba(196,30,58,0.1)', border: '1px solid rgba(196,30,58,0.4)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#f08888', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
      <i className="fa-solid fa-circle-exclamation" style={{ flexShrink: 0 }}></i><span>{formError}</span>
    </div>
  ) : null;

  const inputStyle = (extra = {}) => ({
    width: '100%', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', padding: '0.875rem 1rem 0.875rem 2.8rem', color: '#fff',
    fontSize: '0.92rem', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', ...extra,
  });

  const Field = ({ id, icon, label, type, placeholder, value, onChange, rightEl, extra = {} }) => (
    <div style={{ marginBottom: '1.1rem' }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <i className={icon} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', pointerEvents: 'none' }}></i>
        <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} required style={inputStyle(extra)}
          onFocus={e => { e.target.style.borderColor = 'rgba(196,30,58,0.75)'; e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = '0 0 0 3px rgba(196,30,58,0.12)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none'; }}
        />
        {rightEl && <div style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}>{rightEl}</div>}
      </div>
    </div>
  );

  const EyeBtn = () => (
    <button type="button" onClick={() => setShowPassword(p => !p)}
      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px', display: 'flex', fontSize: '0.88rem' }}>
      <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
    </button>
  );

  const SubmitBtn = ({ label, loadingLabel }) => (
    <button type="submit" disabled={loading} style={{
      width: '100%', padding: '0.95rem', marginTop: '0.4rem',
      background: loading ? 'rgba(196,30,58,0.45)' : 'linear-gradient(135deg, #A50020 0%, #C41E3A 60%, #D63050 100%)',
      border: 'none', borderRadius: '10px', color: '#fff',
      fontWeight: 800, fontSize: '0.82rem', letterSpacing: '2.5px', textTransform: 'uppercase',
      cursor: loading ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
      boxShadow: loading ? 'none' : '0 8px 30px rgba(196,30,58,0.38)',
      transition: 'all 0.22s', fontFamily: 'Inter, sans-serif',
    }}>
      {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> {loadingLabel}</> : label}
    </button>
  );

  const Divider = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.35rem 0', color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }}></div>
      {text}
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }}></div>
    </div>
  );

  const eyebrowLine = (text) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.7rem' }}>
      <div style={{ width: '22px', height: '2px', background: '#C41E3A', borderRadius: '2px', flexShrink: 0 }}></div>
      <span style={{ fontSize: '0.67rem', fontWeight: 700, letterSpacing: '3px', color: '#C41E3A', textTransform: 'uppercase' }}>{text}</span>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Override global body styles that cause scrolling on this page */
        html { overflow: hidden !important; height: 100% !important; }
        body { 
          overflow: hidden !important; 
          height: 100% !important; 
          padding: 0 !important;
          min-height: unset !important;
          display: block !important;
          align-items: unset !important;
          justify-content: unset !important;
        }
        #root { height: 100% !important; overflow: hidden !important; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Root ── */
        .aw-root {
          position: relative; width: 100vw; height: 100vh;
          background: #090909;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        /* Background ambient glow */
        .aw-glow {
          position: absolute; border-radius: 50%; pointer-events: none; z-index: 0;
          filter: blur(90px);
        }
        .aw-glow-1 { width: 550px; height: 550px; top: -160px; right: -120px; background: radial-gradient(circle, rgba(140,0,28,0.2) 0%, transparent 70%); }
        .aw-glow-2 { width: 380px; height: 380px; bottom: -120px; left: -80px; background: radial-gradient(circle, rgba(100,0,20,0.13) 0%, transparent 70%); }

        /* Back button */
        .aw-back {
          position: absolute; top: 1.5rem; left: 1.5rem; z-index: 100;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.55); padding: 0.5rem 1.15rem; border-radius: 50px;
          font-size: 0.78rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 0.45rem;
          transition: all 0.2s; font-family: 'Inter', sans-serif;
        }
        .aw-back:hover { color: #fff; background: rgba(255,255,255,0.1); }

        /* ── Split sections ── */
        /* Login area: left 50% */
        .aw-login-area {
          position: absolute; left: 0; top: 0;
          width: 50%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          padding: 5rem 4vw 3rem;
          z-index: 1; overflow-y: auto;
        }

        /* Register area: right 50% */
        .aw-register-area {
          position: absolute; right: 0; top: 0;
          width: 50%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          padding: 5rem 4vw 3rem;
          z-index: 1; overflow-y: auto;
        }

        .aw-form-inner {
          width: 100%; max-width: 400px;
          animation: fadeUp 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        /* Form title */
        .aw-title {
          font-size: clamp(2.2rem, 3.5vw, 3.2rem); font-weight: 900;
          color: #fff; letter-spacing: -1.5px; line-height: 1.0;
          margin-bottom: 0.5rem; text-transform: uppercase;
        }
        .aw-title-accent { color: #C41E3A; }
        .aw-subtitle { font-size: 0.84rem; color: rgba(255,255,255,0.3); line-height: 1.6; margin-bottom: 2.2rem; }

        /* Thin vertical separator */
        .aw-separator {
          position: absolute; left: 50%; top: 8%; height: 84%;
          width: 1px; background: rgba(255,255,255,0.05);
          transform: translateX(-50%); z-index: 2; pointer-events: none;
          transition: opacity 0.5s ease;
        }

        /* ─── THE SLIDING RED PANEL ─── */
        /* Panel is 50% wide, starts at left: 0 */
        /* Login mode:   panel slides to RIGHT → translateX(100%) covers right half */
        /* Register mode: panel stays at left  → translateX(0%)   covers left half */
        .aw-panel {
          position: absolute; top: 0; left: 0;
          width: 50%; height: 100%;
          background: linear-gradient(148deg, #6B0018 0%, #960E26 30%, #C03040 65%, #8C1525 100%);
          z-index: 50;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 4rem 5%;
          text-align: center;
          transition: transform 0.78s cubic-bezier(0.76, 0, 0.24, 1);
          overflow: hidden;
        }

        /* Decorative rings */
        .aw-panel-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.07); pointer-events: none;
        }
        .aw-ring-1 { width: 130%; height: 130%; top: -20%; left: -20%; }
        .aw-ring-2 { width: 80%; height: 80%; bottom: -20%; right: -20%; border-color: rgba(255,255,255,0.05); }

        /* Login mode: panel on right side */
        .aw-panel.is-login { transform: translateX(100%); }
        /* Register mode: panel on left side */
        .aw-panel.is-register { transform: translateX(0%); }

        /* Panel content */
        .aw-panel-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(0,0,0,0.28);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 2rem; position: relative; z-index: 1;
          box-shadow: 0 8px 28px rgba(0,0,0,0.35);
        }
        .aw-panel-eyebrow {
          font-size: 0.67rem; font-weight: 700; letter-spacing: 3px;
          color: rgba(255,255,255,0.45); text-transform: uppercase;
          margin-bottom: 0.65rem; position: relative; z-index: 1;
        }
        .aw-panel-title {
          font-size: clamp(1.9rem, 3vw, 2.8rem); font-weight: 900; color: #fff;
          letter-spacing: -1px; line-height: 1.05; text-transform: uppercase;
          margin-bottom: 1.1rem; position: relative; z-index: 1;
        }
        .aw-panel-sub {
          font-size: clamp(0.82rem, 0.95vw, 0.9rem); color: rgba(255,255,255,0.58);
          line-height: 1.75; margin-bottom: 2.75rem;
          max-width: 240px; position: relative; z-index: 1;
        }
        .aw-panel-cta {
          background: transparent; border: 2px solid rgba(255,255,255,0.7);
          color: #fff; padding: 0.85rem 2.75rem; border-radius: 50px;
          font-weight: 800; font-size: 0.8rem; cursor: pointer;
          letter-spacing: 2.5px; text-transform: uppercase;
          transition: all 0.25s; font-family: 'Inter', sans-serif;
          position: relative; z-index: 1;
        }
        .aw-panel-cta:hover { background: rgba(255,255,255,0.18); border-color: #fff; transform: translateY(-2px); }

        /* Social buttons */
        .aw-socials { display: flex; gap: 0.75rem; margin-top: 0; }
        .aw-social-btn {
          flex: 1; padding: 0.85rem; border-radius: 10px;
          font-weight: 700; font-size: 0.82rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; transition: all 0.2s; font-family: 'Inter', sans-serif;
        }
        .aw-google { background: #fff; border: none; color: #111; box-shadow: 0 4px 18px rgba(0,0,0,0.3); }
        .aw-google:hover { background: #f3f3f3; transform: translateY(-1px); }
        .aw-phone  { background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.65); }
        .aw-phone:hover  { background: rgba(255,255,255,0.09); transform: translateY(-1px); }

        /* ── MOBILE ── */
        @media (max-width: 700px) {
          .aw-root { overflow: hidden; }

          /* Both form areas are still absolute, but we hide them via JS */
          .aw-login-area, .aw-register-area {
            width: 100%; padding: 1rem 1.5rem 1.5rem;
            justify-content: flex-start; align-items: flex-start;
          }
          /* On mobile the panel is hidden — switching is done via tabs */
          .aw-panel { display: none; }
          .aw-separator { display: none; }
          .aw-socials { flex-direction: column; }
          .aw-mobile-tabs { display: flex !important; }
          .aw-title { font-size: 2.2rem; }
          .aw-form-inner { max-width: 100%; }
        }

        /* Mobile tab bar */
        .aw-mobile-tabs {
          display: none;
          background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 4px; margin-bottom: 1.5rem; gap: 4px;
        }
        .aw-mob-tab {
          flex: 1; padding: 0.7rem; border: none; border-radius: 11px;
          font-weight: 700; font-size: 0.88rem; cursor: pointer;
          transition: all 0.25s; font-family: 'Inter', sans-serif;
        }
        .aw-mob-tab.active { background: linear-gradient(135deg, #6D001A, #C41E3A); color: #fff; box-shadow: 0 4px 16px rgba(109,0,26,0.4); }
        .aw-mob-tab.idle { background: transparent; color: rgba(255,255,255,0.38); }
      `}</style>

      <div className="aw-root">
        {/* Ambient glows */}
        <div className="aw-glow aw-glow-1"></div>
        <div className="aw-glow aw-glow-2"></div>

        <button className="aw-back" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        {/* Thin center line */}
        <div className="aw-separator"></div>

        {/* ══ LEFT: Login form ══ */}
        <div className="aw-login-area" style={{ display: isLogin ? undefined : 'none' }}>
          <div className="aw-form-inner" key="login-form">

            {/* Mobile tabs (hidden on desktop via CSS) */}
            <div className="aw-mobile-tabs">
              <button className={`aw-mob-tab ${isLogin ? 'active' : 'idle'}`} onClick={() => toggleMode(true)}>Sign In</button>
              <button className={`aw-mob-tab ${!isLogin ? 'active' : 'idle'}`} onClick={() => toggleMode(false)}>Register</button>
            </div>

            {eyebrowLine(isPendingSave ? 'Save Progress' : 'Welcome Back')}
            <h1 className="aw-title">Sign <span className="aw-title-accent">In.</span></h1>
            <p className="aw-subtitle">
              {isPendingSave ? 'Sign in to save your CGPA record.' : 'Enter your credentials to access your grade dashboard.'}
            </p>

            {authMethod === 'phone' ? (
              <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
                  <span style={{ color:'rgba(255,255,255,0.65)', fontWeight:700, fontSize:'0.85rem' }}>Phone Sign In</span>
                  <button type="button" onClick={() => switchMethod('email')} style={{ background:'none', border:'none', color:'#C41E3A', cursor:'pointer', fontWeight:700, fontSize:'0.8rem', fontFamily:'Inter,sans-serif' }}>← Email</button>
                </div>
                {errorBox}
                {!showOtpInput ? (
                  <>
                    <Field id="p-phone" icon="fa-solid fa-phone" label="Phone Number" type="tel" placeholder="+8801XXXXXXXXX" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                    <div id="recaptcha-container"></div>
                    <SubmitBtn label="Send OTP" loadingLabel="Sending…" />
                  </>
                ) : (
                  <>
                    <Field id="p-otp" icon="fa-solid fa-key" label="OTP Code" type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} extra={{ letterSpacing:'4px', textAlign:'center' }} />
                    <SubmitBtn label="Verify & Continue" loadingLabel="Verifying…" />
                  </>
                )}
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                {errorBox}
                <Field id="l-email" icon="fa-solid fa-envelope" label="Email Address" type="email" placeholder="name@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
                <Field id="l-pass" icon="fa-solid fa-lock" label="Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} rightEl={<EyeBtn />} />
                <SubmitBtn label="Sign In" loadingLabel="Signing In…" />
              </form>
            )}

            {authMethod === 'email' && <>
              <Divider text="Or continue with" />
              <div className="aw-socials">
                <button type="button" className="aw-social-btn aw-google" onClick={handleGoogle} disabled={loading}>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: 18, height: 18 }} /> Google
                </button>
                <button type="button" className="aw-social-btn aw-phone" onClick={() => switchMethod('phone')} disabled={loading}>
                  <i className="fa-solid fa-mobile-screen-button"></i> Phone
                </button>
              </div>
            </>}
          </div>
        </div>

        {/* ══ RIGHT: Register form ══ */}
        <div className="aw-register-area" style={{ display: !isLogin ? undefined : 'none' }}>
          <div className="aw-form-inner" key="register-form">

            {/* Mobile tabs */}
            <div className="aw-mobile-tabs">
              <button className={`aw-mob-tab ${isLogin ? 'active' : 'idle'}`} onClick={() => toggleMode(true)}>Sign In</button>
              <button className={`aw-mob-tab ${!isLogin ? 'active' : 'idle'}`} onClick={() => toggleMode(false)}>Register</button>
            </div>
            {eyebrowLine('Join Today')}
            <h1 className="aw-title">Create <span className="aw-title-accent">Account.</span></h1>
            <p className="aw-subtitle">Create your free account to track your grades and CGPA every semester.</p>
            <form onSubmit={handleSubmit}>
              {errorBox}
              <Field id="r-email" icon="fa-solid fa-envelope" label="Email Address" type="email" placeholder="name@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
              <Field id="r-pass" icon="fa-solid fa-lock" label="Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} rightEl={<EyeBtn />} />
              <Field id="r-confirm" icon="fa-solid fa-shield-halved" label="Confirm Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <SubmitBtn label="Create Account" loadingLabel="Creating…" />
            </form>
            <Divider text="Or sign up with" />
            <div className="aw-socials">
              <button type="button" className="aw-social-btn aw-google" onClick={handleGoogle} disabled={loading}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: 18, height: 18 }} /> Google
              </button>
              <button type="button" className="aw-social-btn aw-phone" onClick={() => switchMethod('phone')} disabled={loading}>
                <i className="fa-solid fa-mobile-screen-button"></i> Phone
              </button>
            </div>
          </div>
        </div>

        {/* ══ THE SLIDING RED PANEL ══
              • Login mode  → panel translateX(100%)  = covers RIGHT half (hides register form)
              • Register mode → panel translateX(0%)  = covers LEFT half  (hides login form)
        */}
        <div className={`aw-panel ${isLogin ? 'is-login' : 'is-register'}`}>
          <div className="aw-panel-ring aw-ring-1"></div>
          <div className="aw-panel-ring aw-ring-2"></div>

          <div className="aw-panel-icon">
            <img src="/LOGO.png" alt="Logo" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8 }}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
            <i className="fa-solid fa-graduation-cap" style={{ color:'#fff', fontSize:'1.5rem', display:'none' }}></i>
          </div>

          {/* In login mode, panel covers right → invite to register */}
          {isLogin ? (
            <>
              <p className="aw-panel-eyebrow">New here?</p>
              <div className="aw-panel-title">Start<br/>Your Journey</div>
              <p className="aw-panel-sub">Create a free account to calculate, save, and track your CGPA across every semester.</p>
              <button className="aw-panel-cta" onClick={() => toggleMode(false)}>Register Now</button>
            </>
          ) : (
            /* In register mode, panel covers left → invite to sign in */
            <>
              <p className="aw-panel-eyebrow">Have an account?</p>
              <div className="aw-panel-title">Welcome<br/>Back</div>
              <p className="aw-panel-sub">Sign back in to continue tracking your grades and CGPA right where you left off.</p>
              <button className="aw-panel-cta" onClick={() => toggleMode(true)}>Sign In</button>
            </>
          )}
        </div>

      </div>

      <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: 'success' })} />
    </>
  );
}
