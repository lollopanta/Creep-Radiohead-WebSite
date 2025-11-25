import { useRef, useState, Suspense, lazy } from 'react';
import { motion, useInView } from 'framer-motion';
import { ContentData } from '../types';

const Visualizer = lazy(() => import('./Visualizer'));

interface MusicalAnalysisProps {
  content: ContentData['musicalAnalysis'];
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

export default function MusicalAnalysis({ content, audioElement, isPlaying }: MusicalAnalysisProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [tempo, setTempo] = useState(Number(content.tempo.placeholder));

  return (
    <section
      ref={ref}
      className="py-20 px-4 bg-gray-50 dark:bg-gray-800"
      aria-labelledby="musical-analysis-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          id="musical-analysis-heading"
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {content.title}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Tempo slider */}
          <motion.div
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4">
              {/* TODO: Replace with real tempo label */}
              {content.tempo.label}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">
                  {/* TODO: Replace with real tempo value */}
                  {content.tempo.value}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  (Placeholder: {tempo} BPM)
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="180"
                value={tempo}
                onChange={(e) => setTempo(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
                aria-label="Tempo slider (placeholder)"
                disabled
              />
            </div>
          </motion.div>

          {/* Chord progression */}
          <motion.div
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">
              {/* TODO: Replace with real chord progression label */}
              {content.chordProgression.label}
            </h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                {/* TODO: Replace with real chord progression */}
                {content.chordProgression.chords.map((chord, index) => (
                  <motion.div
                    key={index}
                    className="px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-lg border-2 border-primary/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="font-semibold text-primary">
                      {chord}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Key:</span>{' '}
                {content.key}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Audio visualizer */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-center">Audio Visualizer</h3>
          <Suspense fallback={<div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />}>
            <Visualizer audioElement={audioElement} isPlaying={isPlaying} />
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}

