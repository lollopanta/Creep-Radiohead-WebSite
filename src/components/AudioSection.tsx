/**
 * AudioSection Component
 * Integrates AudioPlayer and SyncedLyrics components
 * Manages shared state and synchronization between player and lyrics
 */

import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
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
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:bottom-24 md:w-96 z-40 max-h-[60vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-3 text-center flex-shrink-0">
              Synced Lyrics
            </h3>
            <div className="flex-1 min-h-0">
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

