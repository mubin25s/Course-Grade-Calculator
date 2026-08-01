import { useEffect, useRef, useState } from 'react';

export default function Toast({ message, type = 'success', onDone }) {
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!message) return;
    const showTimer = setTimeout(() => setVisible(true), 0);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDoneRef.current(), 500);
    }, 3000);
    timer.current = { showTimer, hideTimer };
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
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
