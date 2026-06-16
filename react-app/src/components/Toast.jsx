import { useEffect, useRef, useState } from 'react';

export default function Toast({ message, type = 'success', onDone }) {
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    timer.current = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 500);
    }, 3000);
    return () => clearTimeout(timer.current);
  }, [message]);

  if (!message) return null;

  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';

  return (
    <div className={`toast ${type} ${visible ? 'show' : ''}`}>
      <i className={`fa-solid ${icon}`}></i>
      <span>{message}</span>
    </div>
  );
}
