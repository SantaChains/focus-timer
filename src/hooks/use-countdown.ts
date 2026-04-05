import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

interface CountdownOptions {
  initialSeconds: number;
  onFinish?: () => void;
}

export function useCountdown({ initialSeconds, onFinish }: CountdownOptions) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const timerRef = useRef<number | null>(null);

  // 当初始时间改变且处于 idle 状态时，更新剩余时间
  useEffect(() => {
    if (status === 'idle') {
      setSecondsRemaining(initialSeconds);
    }
  }, [initialSeconds, status]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (status === 'running') return;
    
    setStatus('running');
    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setStatus('finished');
          if (onFinish) onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [status, clearTimer, onFinish]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    clearTimer();
    setStatus('paused');
  }, [status, clearTimer]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    start();
  }, [status, start]);

  const reset = useCallback(() => {
    clearTimer();
    setSecondsRemaining(initialSeconds);
    setStatus('idle');
  }, [initialSeconds, clearTimer]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    secondsRemaining,
    status,
    start,
    pause,
    resume,
    reset,
    setSecondsRemaining,
    // 格式化输出
    formatted: {
      hours: Math.floor(secondsRemaining / 3600),
      minutes: Math.floor((secondsRemaining % 3600) / 60),
      seconds: secondsRemaining % 60
    }
  };
}
