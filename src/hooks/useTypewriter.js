import { useState, useEffect } from 'react';

export function useTypewriter(text, speed = 18, autoStart = false) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!autoStart || !text) return;
    setIsStarted(true);
    setDisplayed('');
    setIsDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, autoStart, speed]);

  return { displayed, isDone, isStarted };
}
