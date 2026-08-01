import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Wraps every page with a fade-in/fade-out transition.
 * No more black flashes between routes.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('in'); // 'in' | 'out'

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      const outTimer = setTimeout(() => setStage('out'), 0);
      const t = setTimeout(() => {
        setDisplayLocation(location);
        setStage('in');
      }, 220); // match transition duration
      return () => {
        clearTimeout(outTimer);
        clearTimeout(t);
      };
    }
  }, [location, displayLocation.pathname]);

  return (
    <div
      style={{
        opacity: stage === 'in' ? 1 : 0,
        transform: stage === 'in' ? 'none' : 'translateY(6px)',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {children}
    </div>
  );
}
