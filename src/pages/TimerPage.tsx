import { BellRing, Pause, Play, RotateCcw, Settings2, Volume2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCountdown } from '@/hooks/use-countdown';
import { incrementTodayStats } from '@/lib/storage';
import { cn } from '@/lib/utils';

export const TimerPage: React.FC = () => {
  // 初始设置时间（秒），默认1小时
  const [setupHours, setSetupHours] = useState(1);
  const [setupMinutes, setSetupMinutes] = useState(0);
  const [setupSeconds, setSetupSeconds] = useState(0);

  // 计算总秒数
  const initialTotalSeconds = (setupHours * 3600) + (setupMinutes * 60) + setupSeconds;

  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 1);
    } catch (e) {
      console.warn('Audio feedback failed', e);
    }
  }, []);

  const handleFinish = useCallback(() => {
    incrementTodayStats();
    playBeep();
    toast.success('倒计时结束！恭喜完成一次。', {
      duration: 5000,
      icon: <BellRing className="h-4 w-4 text-primary" />,
    });
    // 简单的浏览器通知
    if (Notification.permission === 'granted') {
      new Notification('倒计时结束', { body: '您的倒计时已完成！' });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  const {
    secondsRemaining,
    status,
    start,
    pause,
    resume,
    reset,
    formatted
  } = useCountdown({
    initialSeconds: initialTotalSeconds > 0 ? initialTotalSeconds : 3600,
    onFinish: handleFinish,
  });

  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isFinished = status === 'finished';

  const formatUnit = (n: number) => String(n).padStart(2, '0');

  // 处理输入变化并自动校验
  const handleInputChange = (
    type: 'h' | 'm' | 's', 
    val: string
  ) => {
    const num = parseInt(val) || 0;
    if (type === 'h') setSetupHours(Math.min(23, Math.max(0, num)));
    if (type === 'm') setSetupMinutes(Math.min(59, Math.max(0, num)));
    if (type === 's') setSetupSeconds(Math.min(59, Math.max(0, num)));
  };

  const onStart = () => {
    if (initialTotalSeconds <= 0) {
      toast.error('请设置有效的倒计时时长');
      return;
    }
    start();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-10 max-w-2xl mx-auto">
      {/* Timer Display */}
      <div className="relative group">
        <div className={cn(
          "relative z-10 p-12 md:p-16 rounded-full border-[12px] transition-all duration-700 bg-background",
          isRunning ? "border-primary shadow-[0_0_30px_rgba(var(--primary),0.3)] pulse-border" : "border-muted",
          isFinished ? "border-destructive animate-bounce" : ""
        )}>
          <div className="flex items-baseline space-x-2 md:space-x-4">
             <div className="flex flex-col items-center">
                <span className="text-6xl md:text-8xl font-black tracking-tighter tabular-nums gradient-text">
                  {formatUnit(formatted.hours)}
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Hours</span>
             </div>
             <span className="text-4xl md:text-6xl font-light text-muted-foreground">:</span>
             <div className="flex flex-col items-center">
                <span className="text-6xl md:text-8xl font-black tracking-tighter tabular-nums gradient-text">
                  {formatUnit(formatted.minutes)}
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Minutes</span>
             </div>
             <span className="text-4xl md:text-6xl font-light text-muted-foreground">:</span>
             <div className="flex flex-col items-center">
                <span className="text-6xl md:text-8xl font-black tracking-tighter tabular-nums gradient-text">
                  {formatUnit(formatted.seconds)}
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Seconds</span>
             </div>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <Card className={cn(
        "w-full transition-all duration-300",
        !isIdle && "opacity-50 pointer-events-none scale-95"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6 text-sm font-medium text-muted-foreground uppercase tracking-widest">
            <Settings2 className="h-4 w-4" />
            <span>设置时长</span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hours">小时 (0-23)</Label>
              <Input
                id="hours"
                type="number"
                value={setupHours}
                onChange={(e) => handleInputChange('h', e.target.value)}
                min={0}
                max={23}
                className="text-center font-bold h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minutes">分钟 (0-59)</Label>
              <Input
                id="minutes"
                type="number"
                value={setupMinutes}
                onChange={(e) => handleInputChange('m', e.target.value)}
                min={0}
                max={59}
                className="text-center font-bold h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seconds">秒 (0-59)</Label>
              <Input
                id="seconds"
                type="number"
                value={setupSeconds}
                onChange={(e) => handleInputChange('s', e.target.value)}
                min={0}
                max={59}
                className="text-center font-bold h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        {isIdle || isFinished ? (
          <Button 
            size="lg" 
            className="w-48 h-14 text-lg font-bold rounded-full shadow-lg transition-transform hover:scale-105"
            onClick={onStart}
          >
            <Play className="mr-2 h-6 w-6" /> 开始
          </Button>
        ) : isRunning ? (
          <Button 
            size="lg" 
            variant="secondary"
            className="w-48 h-14 text-lg font-bold rounded-full shadow-lg transition-transform hover:scale-105"
            onClick={pause}
          >
            <Pause className="mr-2 h-6 w-6" /> 暂停
          </Button>
        ) : (
          <Button 
            size="lg" 
            className="w-48 h-14 text-lg font-bold rounded-full shadow-lg bg-primary transition-transform hover:scale-105"
            onClick={resume}
          >
            <Play className="mr-2 h-6 w-6" /> 继续
          </Button>
        )}

        <Button 
          size="lg" 
          variant="outline" 
          className="w-48 h-14 text-lg font-bold rounded-full border-2 transition-transform hover:scale-105"
          onClick={reset}
        >
          <RotateCcw className="mr-2 h-6 w-6" /> 重置
        </Button>
      </div>

      <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
         <div className="flex items-center gap-1">
            <Volume2 className="h-4 w-4" />
            <span>提醒已开启</span>
         </div>
      </div>
    </div>
  );
};
