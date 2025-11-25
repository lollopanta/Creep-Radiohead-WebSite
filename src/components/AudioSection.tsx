/**
 * AudioSection Component
 * Integrates AudioPlayer and SyncedLyrics components
 * Manages shared state and synchronization between player and lyrics
 */

import { useState, useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { motion } from 'framer-motion';
import AudioPlayer, { AudioPlayerRef } from './AudioPlayer';
import SyncedLyrics from './SyncedLyrics';

interface AudioSectionProps {
  audioPath: string;
  lrcPath: string;
  isOpen: boolean;
  onClose: () => void;
}

const AudioSection = forwardRef<AudioPlayerRef, AudioSectionProps>(
  ({ audioPath, lrcPath, isOpen, onClose }, ref) => {
    const [currentTime, setCurrentTime] = useState(0);
    const audioPlayerRef = useRef<AudioPlayerRef>(null);
    
    // Drag state for lyrics panel
    const [lyricsPosition, setLyricsPosition] = useState<{ x: number; y: number } | null>(null);
    const [isDraggingLyrics, setIsDraggingLyrics] = useState(false);
    const [lyricsDragStart, setLyricsDragStart] = useState<{ x: number; y: number } | null>(null);
    const lyricsPanelRef = useRef<HTMLDivElement>(null);

    // Forward ref methods to parent
    useImperativeHandle(ref, () => ({
      play: () => audioPlayerRef.current?.play(),
      pause: () => audioPlayerRef.current?.pause(),
      seek: (time: number) => audioPlayerRef.current?.seek(time),
      getCurrentTime: () => audioPlayerRef.current?.getCurrentTime() || 0,
      getDuration: () => audioPlayerRef.current?.getDuration() || 0,
      isPlaying: () => audioPlayerRef.current?.isPlaying() || false,
      getAudioElement: () => audioPlayerRef.current?.getAudioElement() || null,
    }));

  // Handle time updates from audio player
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  // Reset lyrics position when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLyricsPosition(null);
    }
  }, [isOpen]);

  // Handle lyrics panel dragging (only from header/drag handle)
  const handleLyricsMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Only allow dragging from the drag handle or header, not from lyrics content
    const isDragHandle = target.closest('[data-drag-handle="true"]');
    const isHeader = target.closest('h3');
    
    if (!isDragHandle && !isHeader) {
      return; // Don't drag if clicking elsewhere (like on lyrics)
    }
    
    // Don't drag if clicking on interactive elements
    if (target.closest('button, input, a, select, textarea')) {
      return;
    }
    
    setIsDraggingLyrics(true);
    const rect = lyricsPanelRef.current?.getBoundingClientRect();
    if (rect) {
      setLyricsDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    e.preventDefault();
  }, []);

  const handleLyricsTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    // Only allow dragging from the drag handle or header
    const isDragHandle = target.closest('[data-drag-handle="true"]');
    const isHeader = target.closest('h3');
    
    if (!isDragHandle && !isHeader) {
      return;
    }
    
    if (target.closest('button, input, a, select, textarea')) {
      return;
    }
    
    setIsDraggingLyrics(true);
    const touch = e.touches[0];
    const rect = lyricsPanelRef.current?.getBoundingClientRect();
    if (rect && touch) {
      setLyricsDragStart({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
    e.preventDefault();
  }, []);

  // Handle mouse move for dragging lyrics panel
  useEffect(() => {
    if (!isDraggingLyrics || !lyricsDragStart) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!lyricsPanelRef.current) return;
      
      const newX = e.clientX - lyricsDragStart.x;
      const newY = e.clientY - lyricsDragStart.y;
      
      // Constrain to viewport bounds
      const rect = lyricsPanelRef.current.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      
      setLyricsPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!lyricsPanelRef.current || !e.touches[0]) return;
      
      const touch = e.touches[0];
      const newX = touch.clientX - lyricsDragStart.x;
      const newY = touch.clientY - lyricsDragStart.y;
      
      // Constrain to viewport bounds
      const rect = lyricsPanelRef.current.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      
      setLyricsPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
      e.preventDefault();
    };

    const handleMouseUp = () => {
      setIsDraggingLyrics(false);
      setLyricsDragStart(null);
    };

    const handleTouchEnd = () => {
      setIsDraggingLyrics(false);
      setLyricsDragStart(null);
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
  }, [isDraggingLyrics, lyricsDragStart]);

  return (
    <div className="w-full">
      {/* Audio Player */}
      <AudioPlayer
        ref={audioPlayerRef}
        audioPath={audioPath}
        isOpen={isOpen}
        onClose={onClose}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Synced Lyrics - Only show when player is open */}
      {isOpen && (
        <motion.div
          ref={lyricsPanelRef}
          className={`fixed z-40 select-none ${
            lyricsPosition 
              ? 'w-96' 
              : 'bottom-20 left-4 right-4 md:left-auto md:right-4 md:bottom-24 md:w-96'
          }`}
          style={{
            ...(lyricsPosition && {
              left: `${lyricsPosition.x}px`,
              top: `${lyricsPosition.y}px`,
              transform: 'none',
            }),
            maxHeight: '60vh',
            height: '60vh',
            cursor: isDraggingLyrics ? 'grabbing' : 'default',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 h-full flex flex-col">
            {/* Drag handle */}
            <div
              data-drag-handle="true"
              className="absolute top-0 left-0 right-0 h-10 rounded-t-lg flex items-center justify-center cursor-grab active:cursor-grabbing touch-none z-10"
              onMouseDown={handleLyricsMouseDown}
              onTouchStart={handleLyricsTouchStart}
            >
              <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
            <h3 
              data-drag-handle="true"
              className="text-lg font-semibold mb-3 text-center flex-shrink-0 pt-2 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleLyricsMouseDown}
              onTouchStart={handleLyricsTouchStart}
            >
              Synced Lyrics
            </h3>
            <div className="flex-1 min-h-0 overflow-hidden">
              <SyncedLyrics currentTime={currentTime} lrcPath={lrcPath} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
});

AudioSection.displayName = 'AudioSection';

export default AudioSection;

