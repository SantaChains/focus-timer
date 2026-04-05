/**
 * Video Player Component
 * 
 * Native HTML5 Video player with custom controls
 * 
 * Usage example:
 * <Video
 *   src="" // Video resource URL, defaults to empty string
 *   poster="https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png" // Video poster image
 * />
 */

import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from './button';
import { Slider } from './slider';

interface VideoProps {
    src: string;
    poster?: string;
    className?: string;
    autoPlay?: boolean;
    muted?: boolean;
    controls?: boolean;
    aspectRatio?: string | 'auto' | '16:9' | '4:3';
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function Video({
    className,
    src,
    poster,
    autoPlay = false,
    muted = false,
    controls = true,
    aspectRatio = 'auto'
}: VideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    }, []);

    const handleSeek = useCallback((value: number[]) => {
        if (videoRef.current) {
            videoRef.current.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    }, []);

    const toggleFullscreen = useCallback(() => {
        const container = videoRef.current?.parentElement;
        if (!container) return;

        if (!isFullscreen) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    }, [isFullscreen]);

    const aspectRatioClass = aspectRatio === '16:9' ? 'aspect-video' : 
                             aspectRatio === '4:3' ? 'aspect-[4/3]' : '';

    return (
        <div 
            className={`relative min-w-[100px] bg-black rounded-lg overflow-hidden ${aspectRatioClass} ${className}`}
            custom-component="video"
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                muted={muted}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
            
            {controls && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center gap-2 text-white">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:bg-white/20"
                            onClick={togglePlay}
                        >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:bg-white/20"
                            onClick={toggleMute}
                        >
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        
                        <span className="text-xs min-w-[80px]">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                        
                        <Slider
                            value={[currentTime]}
                            max={duration || 100}
                            step={0.1}
                            onValueChange={handleSeek}
                            className="flex-1"
                        />
                        
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:bg-white/20"
                            onClick={toggleFullscreen}
                        >
                            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            )}
            
            {!isPlaying && !autoPlay && (
                <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                >
                    <div className="w-12 h-10 rounded-md bg-black/60 border border-white/30 flex items-center justify-center hover:bg-black/80 transition-colors">
                        <Play className="h-5 w-5 text-white ml-1" />
                    </div>
                </button>
            )}
        </div>
    );
}
