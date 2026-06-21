/**
 * AppLoader — shown during initial Firebase auth state resolution.
 * Replaces the black void with a branded, animated splash screen.
 */
export default function AppLoader() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;900&display=swap');

        @keyframes loaderFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes loaderPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.06); }
        }
        @keyframes loaderSpin {
          to { stroke-dashoffset: 0; }
        }
        @keyframes loaderDot {
          0%, 80%, 100% { transform: scaleY(0.5); opacity: 0.3; }
          40%           { transform: scaleY(1);   opacity: 1; }
        }

        .apl-root {
          position: fixed; inset: 0;
          background: #080808;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          z-index: 9999;
          animation: loaderFadeIn 0.3s ease both;
          font-family: 'Inter', sans-serif;
        }

        /* Ambient glow */
        .apl-root::before {
          content: '';
          position: absolute; top: -200px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(140,0,28,0.18) 0%, transparent 65%);
          pointer-events: none;
        }

        .apl-icon-wrap {
          position: relative; margin-bottom: 2.25rem;
          animation: loaderPulse 1.8s ease-in-out infinite;
        }

        .apl-icon-bg {
          width: 88px; height: 88px; border-radius: 22px;
          background: linear-gradient(145deg, #6D001A, #C41E3A);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 16px 48px rgba(109,0,26,0.5), 0 0 0 1px rgba(255,255,255,0.06);
        }

        /* Spinning ring around the icon */
        .apl-ring {
          position: absolute; inset: -10px;
          width: 108px; height: 108px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: rgba(196,30,58,0.7);
          border-right-color: rgba(196,30,58,0.3);
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .apl-title {
          font-size: 1.35rem; font-weight: 900;
          color: #fff; letter-spacing: -0.5px;
          text-transform: uppercase; margin-bottom: 0.35rem;
          text-align: center;
        }
        .apl-sub {
          font-size: 0.78rem; color: rgba(255,255,255,0.28);
          letter-spacing: 1px; margin-bottom: 2.5rem;
          text-align: center;
        }

        /* Three animated bars */
        .apl-bars {
          display: flex; gap: 5px; align-items: center; height: 24px;
        }
        .apl-bar {
          width: 4px; border-radius: 4px;
          background: #C41E3A;
          animation: loaderDot 1.2s ease-in-out infinite;
        }
        .apl-bar:nth-child(1) { animation-delay: 0s;    height: 14px; }
        .apl-bar:nth-child(2) { animation-delay: 0.15s; height: 20px; }
        .apl-bar:nth-child(3) { animation-delay: 0.3s;  height: 14px; }
        .apl-bar:nth-child(4) { animation-delay: 0.45s; height: 20px; }
        .apl-bar:nth-child(5) { animation-delay: 0.6s;  height: 14px; }
      `}</style>

      <div className="apl-root">
        <div className="apl-icon-wrap">
          <div className="apl-icon-bg">
            <i className="fa-solid fa-graduation-cap" style={{ color: '#fff', fontSize: '2rem' }}></i>
          </div>
          <div className="apl-ring"></div>
        </div>

        <div className="apl-title">Grade Calculator</div>
        <div className="apl-sub">Academic Tracker</div>

        <div className="apl-bars">
          <div className="apl-bar"></div>
          <div className="apl-bar"></div>
          <div className="apl-bar"></div>
          <div className="apl-bar"></div>
          <div className="apl-bar"></div>
        </div>
      </div>
    </>
  );
}
