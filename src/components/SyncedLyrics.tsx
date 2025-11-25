/**
 * SyncedLyrics Component
 * Displays lyrics synchronized with audio playback using LRC file format
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { parseLRC, findActiveLyric, LyricLine } from '../utils/parseLRC';

interface SyncedLyricsProps {
  currentTime: number; // Current playback time in seconds
  lrcPath: string; // Path to LRC file
}

export default function SyncedLyrics({ currentTime, lrcPath }: SyncedLyricsProps) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Load and parse LRC file
  useEffect(() => {
    let isMounted = true;

    const loadLRC = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(lrcPath);
        
        if (!response.ok) {
          throw new Error(`Failed to load LRC file: ${response.statusText}`);
        }

        const lrcContent = await response.text();
        const parsedLyrics = parseLRC(lrcContent);

        if (isMounted) {
          setLyrics(parsedLyrics);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading LRC file:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load lyrics file');
          setLoading(false);
          setLyrics([]);
        }
      }
    };

    loadLRC();

    return () => {
      isMounted = false;
    };
  }, [lrcPath]);

  // Find active lyric line based on current time
  useEffect(() => {
    if (lyrics.length === 0) return;

    const newActiveIndex = findActiveLyric(lyrics, currentTime);
    
    if (newActiveIndex !== activeIndex) {
      setActiveIndex(newActiveIndex);
    }
  }, [currentTime, lyrics, activeIndex]);

  // Auto-scroll to active line
  useEffect(() => {
    if (activeIndex >= 0 && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const activeLine = lineRefs.current[activeIndex];
      
      if (!activeLine) return;
      
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (!container || !activeLine) return;
        
        const containerRect = container.getBoundingClientRect();
        const lineRect = activeLine.getBoundingClientRect();
        
        // Calculate positions relative to container
        const lineTop = lineRect.top - containerRect.top + container.scrollTop;
        const lineBottom = lineTop + lineRect.height;
        const lineCenter = lineTop + (lineRect.height / 2);
        const containerHeight = container.clientHeight;
        const containerCenter = containerHeight / 2;
        const scrollTop = container.scrollTop;
        const scrollBottom = scrollTop + containerHeight;
        
        // Check if line is visible
        const isLineVisible = lineTop >= scrollTop && lineBottom <= scrollBottom;
        
        // Calculate desired scroll position to center the active line
        const desiredScrollTop = lineCenter - containerCenter;
        
        // Always scroll to keep active line centered, or if it's not visible
        if (!isLineVisible || Math.abs(container.scrollTop - desiredScrollTop) > 5) {
          container.scrollTo({
            top: Math.max(0, desiredScrollTop),
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
          });
        }
      });
    }
  }, [activeIndex, prefersReducedMotion]);

  // Show all lyrics (for better user experience)
  const displayLyrics = useMemo(() => {
    return lyrics.map((lyric, idx) => ({
      ...lyric,
      originalIndex: idx,
    }));
  }, [lyrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading lyrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Unable to load lyrics file: {error}
        </p>
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
          Path: {lrcPath}
        </p>
      </div>
    );
  }

  if (lyrics.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No lyrics available
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <div
        ref={lyricsContainerRef}
        className="h-full overflow-y-auto scroll-smooth px-4 py-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(242, 167, 4, 0.5) transparent',
        }}
      >
        <div className="space-y-1 text-center pb-8">
          {displayLyrics.map((lyric, idx) => {
            const isActive = lyric.originalIndex === activeIndex;
            
            return (
              <motion.div
                key={`${lyric.time}-${idx}`}
                ref={(el) => {
                  if (el) {
                    lineRefs.current[lyric.originalIndex] = el;
                  }
                }}
                className={`py-2 px-4 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary/20 dark:bg-primary/30 text-primary dark:text-pablo-yellow font-semibold'
                    : 'text-gray-600 dark:text-gray-400 opacity-60'
                }`}
                initial={false}
                animate={{
                  scale: isActive && !prefersReducedMotion ? 1.02 : 1,
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                  ease: 'easeOut',
                }}
              >
                {lyric.text || '\u00A0'} {/* Non-breaking space for empty lines */}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

