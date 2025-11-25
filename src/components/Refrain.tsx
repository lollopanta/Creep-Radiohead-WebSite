import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ContentData } from '../types';
import { AudioPlayerRef } from '../types';

interface RefrainProps {
  content: ContentData['refrain'];
  audioPlayerRef: React.RefObject<AudioPlayerRef>;
  onPlayChorusClick: () => void;
}

export default function Refrain({ content, audioPlayerRef, onPlayChorusClick }: RefrainProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const handlePlayChorus = () => {
    // Open the modal first
    onPlayChorusClick();
    
    // Wait for the modal to open and audio element to be ready
    // Try multiple times in case the audio element needs more time to load
    const attemptSeekAndPlay = (attempts = 0) => {
      if (audioPlayerRef.current) {
        const audioElement = audioPlayerRef.current.getAudioElement();
        // Check if audio element is ready
        if (audioElement && audioElement.readyState >= 2) {
          // Seek to 0:57 (57 seconds)
          const chorusStartTime = 57;
          audioPlayerRef.current.seek(chorusStartTime);
          audioPlayerRef.current.play();
        } else if (attempts < 10) {
          // Try again after a short delay (up to 10 attempts = ~1 second)
          setTimeout(() => attemptSeekAndPlay(attempts + 1), 100);
        }
      } else if (attempts < 10) {
        // Audio ref not ready yet, try again
        setTimeout(() => attemptSeekAndPlay(attempts + 1), 100);
      }
    };
    
    // Start attempting after initial delay
    setTimeout(() => attemptSeekAndPlay(), 200);
  };

  return (
    <section
      ref={ref}
      className="py-20 px-4 bg-gradient-to-br from-pablo-beige/30 to-pablo-cream/30 dark:from-pablo-orange/10 dark:to-pablo-yellow/10"
      aria-labelledby="refrain-heading"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          id="refrain-heading"
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {content.title}
        </motion.h2>

        <motion.div
          className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Animated wave background effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-5 dark:opacity-10"
            animate={{
              background: [
                'linear-gradient(45deg, #F2A704, #6484AC)',
                'linear-gradient(135deg, #6484AC, #F2A704)',
                'linear-gradient(45deg, #F2A704, #6484AC)',
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Lyrics */}
          <div className="relative z-10">
            <motion.pre
              className="text-xl md:text-2xl font-serif text-gray-900 dark:text-gray-100 whitespace-pre-wrap text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {content.lyrics}
            </motion.pre>
          </div>

          {/* Play chorus button */}
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              onClick={handlePlayChorus}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold focus:outline-none focus:ring-4 focus:ring-primary/50 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Play chorus"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Chorus
              <span className="text-xs opacity-75">
                ({content.startTime})
              </span>
            </motion.button>
          </motion.div>

          {/* Description */}
          <motion.p
            className="mt-8 text-gray-700 dark:text-gray-300 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {content.description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

