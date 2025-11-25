/**
 * AudioPlayer Component - Built from scratch
 * A fully functional audio player with play/pause, seek, volume, and time display
 */

import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Types
export interface AudioPlayerRef {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  isPlaying: () => boolean;
  getAudioElement: () => HTMLAudioElement | null;
}

export interface AudioPlayerProps {
  audioPath: string;
  isOpen: boolean;
  onClose: () => void;
  onTimeUpdate?: (currentTime: number) => void; // Callback for time updates (for synced lyrics)
}

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  ({ audioPath, isOpen, onClose, onTimeUpdate }, ref) => {
    // State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isBuffering, setIsBuffering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    // Drag state for modal
    const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | null>(null);
    const [isDraggingModal, setIsDraggingModal] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
    
    // Refs
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLInputElement>(null);
    const volumeRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const onTimeUpdateRef = useRef(onTimeUpdate);
    const prefersReducedMotion = useReducedMotion();

    // Keep refs in sync
    useEffect(() => {
      isDraggingRef.current = isDragging;
    }, [isDragging]);

    useEffect(() => {
      onTimeUpdateRef.current = onTimeUpdate;
    }, [onTimeUpdate]);

    
    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      play: () => {
        audioRef.current?.play().catch(() => {
          setError('Failed to play audio');
        });
      },
      pause: () => {
        audioRef.current?.pause();
      },
      seek: (time: number) => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isNaN(time) || !isFinite(time) || time < 0) return;

        // Use audio element's duration if available, otherwise use React state
        const audioDuration = audio.duration;
        const maxTime = audioDuration && isFinite(audioDuration) && audioDuration > 0 
          ? audioDuration 
          : (duration > 0 ? duration : Infinity); // Allow seeking even if duration not loaded yet

        const newTime = maxTime === Infinity ? time : Math.max(0, Math.min(time, maxTime));

        try {
          audio.currentTime = newTime;
          setCurrentTime(newTime);
          onTimeUpdateRef.current?.(newTime);
        } catch (err) {
          // Silent fail for seek errors
        }
      },
      getCurrentTime: () => {
        return audioRef.current?.currentTime || 0;
      },
      getDuration: () => {
        return audioRef.current?.duration || 0;
      },
      isPlaying: () => {
        // Return actual audio element state, not React state (which might be out of sync)
        return !audioRef.current?.paused || false;
      },
      getAudioElement: () => {
        return audioRef.current;
      },
    }));

    // Initialize audio element and event listeners (only when modal is open)
    useEffect(() => {
      // Don't set up listeners if modal is closed - audio element won't exist
      if (!isOpen) return;

      const audio = audioRef.current;
      if (!audio) {
        // Audio element may not be rendered yet in React strict mode
        // This is fine - the effect will re-run when the element is available
        return;
      }

      // Reset error state when audio path changes
      setError(null);

      // Event handlers (defined here, inside the effect scope)
      const handleTimeUpdate = () => {
        if (!isDraggingRef.current && audio && audio.readyState >= 2) {
          const newTime = audio.currentTime;
          if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
            setCurrentTime(newTime);
            onTimeUpdateRef.current?.(newTime);
          }
        }
      };

      const handleLoadedMetadata = () => {
        if (audio && audio.duration && isFinite(audio.duration)) {
          setDuration(audio.duration);
          setError(null);
        }
      };

      const handleCanPlay = () => {
        setIsBuffering(false);
        setError(null);
      };

      const handleCanPlayThrough = () => {
        setIsBuffering(false);
      };

      const handleWaiting = () => {
        setIsBuffering(true);
      };

      const handlePlay = () => {
        // Update state immediately on play event
        setIsPlaying(true);
        setIsBuffering(false);
      };

      const handlePlaying = () => {
        setIsBuffering(false);
        setIsPlaying(true);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      const handleError = () => {
        setIsPlaying(false);
        setIsBuffering(false);
        const errorCode = audio.error?.code;
        let errorMsg = 'Failed to load audio file.';
        
        if (errorCode === 4) {
          errorMsg = 'Audio file not found. Please check the file path.';
        } else if (errorCode) {
          errorMsg = `Audio error (code ${errorCode}). Please check the file.`;
        }
        
        setError(errorMsg);
      };

      const handleVolumeChange = () => {
        if (audio) {
          setVolume(audio.volume);
        }
      };

      const handleLoadStart = () => {
        // Audio loading started
      };

      const handleProgress = () => {
        // Audio buffering progress
      };

      // Add event listeners
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('progress', handleProgress);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('play', handlePlay); // Add play event listener
      audio.addEventListener('playing', handlePlaying);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('volumechange', handleVolumeChange);

      // Set initial volume from state
      const currentVolume = volume;
      if (!isNaN(currentVolume) && currentVolume >= 0 && currentVolume <= 1) {
        audio.volume = currentVolume;
      }

      // Try to load metadata if not already loaded
      if (audio.readyState < 1) {
        audio.load();
      }

      // Cleanup function for event listeners
      return () => {
        const cleanupAudio = audioRef.current;
        if (cleanupAudio) {
          cleanupAudio.removeEventListener('loadstart', handleLoadStart);
          cleanupAudio.removeEventListener('progress', handleProgress);
          cleanupAudio.removeEventListener('timeupdate', handleTimeUpdate);
          cleanupAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          cleanupAudio.removeEventListener('canplay', handleCanPlay);
          cleanupAudio.removeEventListener('canplaythrough', handleCanPlayThrough);
          cleanupAudio.removeEventListener('waiting', handleWaiting);
          cleanupAudio.removeEventListener('play', handlePlay);
          cleanupAudio.removeEventListener('playing', handlePlaying);
          cleanupAudio.removeEventListener('pause', handlePause);
          cleanupAudio.removeEventListener('ended', handleEnded);
          cleanupAudio.removeEventListener('error', handleError);
          cleanupAudio.removeEventListener('volumechange', handleVolumeChange);
        }
      };
    }, [audioPath, isOpen]); // Re-run when audio path changes or modal opens/closes

    // Sync volume changes to audio element (separate effect to avoid re-registering listeners)
    useEffect(() => {
      const audio = audioRef.current;
      if (audio && !isNaN(volume) && volume >= 0 && volume <= 1) {
        // Only update if different to avoid unnecessary updates
        if (Math.abs(audio.volume - volume) > 0.01) {
          audio.volume = volume;
        }
      }
    }, [volume]);

    // Reset when modal closes
    useEffect(() => {
      if (!isOpen) {
        setIsPlaying(false);
        setError(null);
        setIsBuffering(false);
        setCurrentTime(0);
        setModalPosition(null); // Reset position when modal closes
      }
    }, [isOpen]);

    // Handle modal dragging
    const handleModalMouseDown = useCallback((e: React.MouseEvent) => {
      // Only drag from header area or non-interactive elements
      const target = e.target as HTMLElement;
      // Don't drag if clicking on interactive elements
      if (target.closest('button, input, a, select, textarea')) {
        return;
      }
      
      setIsDraggingModal(true);
      const rect = modalRef.current?.getBoundingClientRect();
      if (rect) {
        setDragStart({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      e.preventDefault();
    }, []);

    const handleModalTouchStart = useCallback((e: React.TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, input, a, select, textarea')) {
        return;
      }
      
      setIsDraggingModal(true);
      const touch = e.touches[0];
      const rect = modalRef.current?.getBoundingClientRect();
      if (rect && touch) {
        setDragStart({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
      }
      e.preventDefault();
    }, []);

    // Handle mouse move for dragging
    useEffect(() => {
      if (!isDraggingModal || !dragStart) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!modalRef.current) return;
        
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Constrain to viewport bounds
        const rect = modalRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        
        setModalPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!modalRef.current || !e.touches[0]) return;
        
        const touch = e.touches[0];
        const newX = touch.clientX - dragStart.x;
        const newY = touch.clientY - dragStart.y;
        
        // Constrain to viewport bounds
        const rect = modalRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        
        setModalPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
        e.preventDefault();
      };

      const handleMouseUp = () => {
        setIsDraggingModal(false);
        setDragStart(null);
      };

      const handleTouchEnd = () => {
        setIsDraggingModal(false);
        setDragStart(null);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('touchcancel', handleTouchEnd);
      };
    }, [isDraggingModal, dragStart]);

    // Toggle play/pause
    const togglePlayPause = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;

      if (audio.paused) {
        audio.play().catch(() => {
          setError('Failed to play audio');
        });
      } else {
        audio.pause();
      }
    }, []);

    // Handle progress bar change (seeking)
    const handleProgressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) return;

      const time = parseFloat(e.target.value);
      if (isNaN(time) || !isFinite(time) || time < 0) return;

      // Use audio element's duration if available, otherwise use React state, otherwise allow seeking anyway
      const audioDuration = audio.duration;
      const maxTime = audioDuration && isFinite(audioDuration) && audioDuration > 0 
        ? audioDuration 
        : (duration > 0 ? duration : Infinity); // Allow seeking even if duration not loaded yet

      const newTime = maxTime === Infinity ? time : Math.max(0, Math.min(time, maxTime));

      try {
        audio.currentTime = newTime;
        setCurrentTime(newTime);
        onTimeUpdateRef.current?.(newTime);
      } catch (err) {
        // Silent fail for seek errors
      }
    }, [duration]);

    // Handle progress bar drag start
    const handleProgressMouseDown = useCallback(() => {
      setIsDragging(true);
    }, []);

    // Handle progress bar drag end
    const handleProgressMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Handle volume change
    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      if (!isNaN(newVolume) && newVolume >= 0 && newVolume <= 1 && audioRef.current) {
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
      }
    }, []);

    // Format time helper
    const formatTime = useCallback((time: number): string => {
      if (!isFinite(time) || isNaN(time) || time < 0) return '0:00';
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyPress = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;

        // Don't interfere with input fields
        if (target.tagName === 'INPUT') {
          if ((target as HTMLInputElement).type === 'range') {
            // Allow arrow keys on range inputs
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
              return;
            }
          } else {
            return; // Don't handle other inputs
          }
        }

        if (e.code === 'Space') {
          e.preventDefault();
          togglePlayPause();
        } else if (e.code === 'ArrowRight' && audioRef.current) {
          e.preventDefault();
          const newTime = Math.min(audioRef.current.currentTime + 10, duration || 0);
          audioRef.current.currentTime = newTime;
        } else if (e.code === 'ArrowLeft' && audioRef.current) {
          e.preventDefault();
          const newTime = Math.max(audioRef.current.currentTime - 10, 0);
          audioRef.current.currentTime = newTime;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }, [isOpen, duration, togglePlayPause]);


    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Player Modal */}
            <motion.div
              ref={modalRef}
              className={`fixed max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6 select-none ${
                modalPosition 
                  ? '' 
                  : 'inset-x-4 bottom-4 md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2'
              }`}
              style={{
                ...(modalPosition && {
                  left: `${modalPosition.x}px`,
                  top: `${modalPosition.y}px`,
                  transform: 'none',
                }),
                cursor: isDraggingModal ? 'grabbing' : 'default',
              }}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                ...(modalPosition ? { x: 0, y: 0 } : {})
              }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{
                type: prefersReducedMotion ? 'tween' : 'spring',
                damping: 25,
                stiffness: 300,
                duration: prefersReducedMotion ? 0.2 : undefined,
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Audio player"
            >
              {/* Drag handle area - visual indicator */}
              <div
                className="absolute top-0 left-0 right-0 h-12 rounded-t-2xl flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
                onMouseDown={handleModalMouseDown}
                onTouchStart={handleModalTouchStart}
              >
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                aria-label="Close audio player"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Hidden audio element */}
              <audio
                ref={audioRef}
                src={audioPath}
                preload="auto"
                crossOrigin="anonymous"
              />

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Path: {audioPath}
                  </p>
                </div>
              )}

              {/* Controls */}
              <div className="space-y-4 mt-4">
                {/* Play/Pause button */}
                <div className="flex justify-center">
                  <motion.button
                    onClick={togglePlayPause}
                    disabled={!!error}
                    className="relative w-16 h-16 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileHover={prefersReducedMotion || error ? {} : { scale: 1.1 }}
                    whileTap={prefersReducedMotion || error ? {} : { scale: 0.95 }}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {/* Buffering indicator */}
                    {isBuffering && (
                      <div className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    
                    {isPlaying ? (
                      <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 ml-1 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </motion.button>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      ref={progressRef}
                      type="range"
                      min="0"
                      max={(() => {
                        // Use audio element's duration if available, otherwise React state, otherwise placeholder
                        const audioDuration = audioRef.current?.duration;
                        if (audioDuration && isFinite(audioDuration) && audioDuration > 0) {
                          return audioDuration;
                        }
                        return duration > 0 ? duration : 100;
                      })()}
                      step="0.01"
                      value={currentTime}
                      onChange={handleProgressChange}
                      onMouseDown={handleProgressMouseDown}
                      onMouseUp={handleProgressMouseUp}
                      onTouchStart={handleProgressMouseDown}
                      onTouchEnd={handleProgressMouseUp}
                      disabled={!!error || (!audioRef.current?.duration && duration === 0)}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: (() => {
                          // Calculate progress using audio element duration if available
                          const audioDuration = audioRef.current?.duration;
                          const effectiveDuration = (audioDuration && isFinite(audioDuration) && audioDuration > 0) 
                            ? audioDuration 
                            : duration;
                          if (effectiveDuration > 0) {
                            const percent = (currentTime / effectiveDuration) * 100;
                            return `linear-gradient(to right, rgb(242, 167, 4) 0%, rgb(242, 167, 4) ${percent}%, rgb(229, 231, 235) ${percent}%, rgb(229, 231, 235) 100%)`;
                          }
                          return undefined;
                        })()
                      }}
                      aria-label="Seek audio"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Volume control */}
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                  <input
                    ref={volumeRef}
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    style={{
                      background: `linear-gradient(to right, rgb(242, 167, 4) 0%, rgb(242, 167, 4) ${volume * 100}%, rgb(229, 231, 235) ${volume * 100}%, rgb(229, 231, 235) 100%)`,
                    }}
                    aria-label="Volume"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>

                {/* Keyboard shortcuts hint */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                  Space: Play/Pause • ← →: Skip 10s
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
