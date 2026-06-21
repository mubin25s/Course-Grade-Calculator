import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackgroundGlobes from '../components/BackgroundGlobes';
import Toast from '../components/Toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Check if we came from a redirect to save pending records
  const isPendingSave = searchParams.get('redirect') === 'save-pending';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setFormError('Please fill in all fields.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(false);
    setLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await login(trimmedEmail, password);
      } else {
        res = await register(trimmedEmail, password);
      }

      if (res.success) {
        const justSaved = sessionStorage.getItem('justSavedPending');
        if (justSaved) {
          sessionStorage.removeItem('justSavedPending');
          showToast('Account verified & CGPA record saved successfully!', 'success');
          setTimeout(() => {
            navigate('/profile');
          }, 1500);
        } else {
          showToast(isLogin ? 'Logged in successfully!' : 'Registration successful!', 'success');
          setTimeout(() => {
            navigate('/profile');
          }, 1500);
        }
      } else {
        setLoading(false);
        // Handle Firebase errors humanely
        let errorMsg = 'An error occurred. Please try again.';
        if (res.error?.code === 'auth/email-already-in-use') {
          errorMsg = 'This email is already in use.';
        } else if (res.error?.code === 'auth/invalid-credential') {
          errorMsg = 'Incorrect email or password.';
        } else if (res.error?.code === 'auth/invalid-email') {
          errorMsg = 'Please enter a valid email address.';
        } else if (res.error?.message) {
          errorMsg = res.error.message;
        }
        setFormError(errorMsg);
      }
    } catch (err) {
      setLoading(false);
      setFormError('An unexpected error occurred. Please try again.');
      console.error(err);
    }
  };

  const toggleMode = (loginMode) => {
    setIsLogin(loginMode);
    setFormError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="universal-calc-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <BackgroundGlobes />

      <div className="back-nav" style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 100 }}>
        <a href="/" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="back-link" style={{ marginBottom: 0 }}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </a>
      </div>

      <div className="container" style={{ maxWidth: 450, margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div className="header-icon" style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <i className="fa-solid fa-user-shield" style={{ color: '#fff', fontSize: '1.75rem' }}></i>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>
            {isPendingSave ? 'Save Your Progress' : 'Welcome'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isPendingSave 
              ? 'Please sign in or create an account to save your CGPA record.' 
              : 'Sign in or register to sync your grading achievements.'}
          </p>
        </header>

        {/* Tab Toggle */}
        <div style={{ 
          display: 'flex', 
          background: 'rgba(109, 0, 26, 0.05)', 
          border: '1px solid var(--glass-border)', 
          borderRadius: '50px', 
          padding: '4px', 
          marginBottom: '1.5rem',
          position: 'relative'
        }}>
          <button 
            type="button" 
            onClick={() => toggleMode(true)}
            style={{ 
              flex: 1, 
              background: isLogin ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
              color: isLogin ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '0.6rem',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            onClick={() => toggleMode(false)}
            style={{ 
              flex: 1, 
              background: !isLogin ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
              color: !isLogin ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '0.6rem',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Register
          </button>
        </div>

        {/* Card Form */}
        <div className="card" style={{ padding: '2rem', background: '#070707', borderRadius: '24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {formError && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid var(--danger)', 
                borderRadius: '12px', 
                padding: '0.75rem', 
                color: 'var(--danger)', 
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{formError}</span>
              </div>
            )}

            {/* Email field */}
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fa-solid fa-envelope"></i> Email Address
              </label>
              <input 
                type="email" 
                placeholder="name@university.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Password field */}
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i className="fa-solid fa-lock"></i> Password
                </span>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </label>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Confirm Password field (Register only) */}
            {!isLogin && (
              <div className="input-group" style={{ animation: 'fadeIn 0.3s ease' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i className="fa-solid fa-shield-halved"></i> Confirm Password
                </label>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="dashboard-btn" 
              disabled={loading}
              style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Processing...
                </>
              ) : (
                <>
                  <i className={isLogin ? "fa-solid fa-right-to-bracket" : "fa-solid fa-user-plus"}></i>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        onDone={() => setToast({ message: '', type: 'success' })} 
      />
    </div>
  );
}
