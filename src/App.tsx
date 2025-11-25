import { useState, useRef, lazy, Suspense, useEffect } from 'react';
import contentData from '../data/content.json';
import { ContentData, AudioPlayerRef } from './types';

// Lazy load heavy components for code splitting
const Timeline = lazy(() => import('./components/Timeline'));

// Regular imports for lighter components
import Hero from './components/Hero';
import AudioSection from './components/AudioSection';
import AboutBand from './components/AboutBand';
import Album from './components/Album';
import Structure from './components/Structure';
import Refrain from './components/Refrain';
import PoeticDevices from './components/PoeticDevices';
import MusicalAnalysis from './components/MusicalAnalysis';
import LyricsExplorer from './components/LyricsExplorer';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

const content = contentData as ContentData;

function App() {
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayClick = () => {
    setIsAudioPlayerOpen(true);
    // Auto-play when modal opens
    setTimeout(() => {
      audioPlayerRef.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  // Monitor play state and update audio element ref (less frequently to avoid excessive calls)
  useEffect(() => {
    if (!isAudioPlayerOpen) return;
    
    const checkPlayState = () => {
      if (audioPlayerRef.current) {
        const playing = audioPlayerRef.current.isPlaying();
        setIsPlaying(playing);
        audioElementRef.current = audioPlayerRef.current.getAudioElement();
      }
    };
    // Check every 2 seconds instead of 500ms to reduce excessive calls
    const interval = setInterval(checkPlayState, 2000);
    // Also check immediately
    checkPlayState();
    return () => clearInterval(interval);
  }, [isAudioPlayerOpen]);

  return (
    <div className="min-h-screen">
      <ThemeToggle />

      {/* Hero Section */}
      <Hero content={content.hero} onPlayClick={handlePlayClick} />

      {/* Audio Player with Synced Lyrics */}
      <AudioSection
        ref={audioPlayerRef}
        audioPath={content.audio.path}
        lrcPath="/assets/audio/creep.lrc"
        isOpen={isAudioPlayerOpen}
        onClose={() => {
          setIsAudioPlayerOpen(false);
          setIsPlaying(false);
        }}
      />

      {/* Main Content Sections */}
      <main>
        {/* About the Band */}
        <AboutBand content={content.band} />

        {/* Album */}
        <Album content={content.album} />

        {/* Song History Timeline */}
        <Suspense fallback={<TimelineSkeleton />}>
          <Timeline content={content.songHistory} />
        </Suspense>

        {/* Structure & Meter */}
        <Structure content={content.structure} />

        {/* Refrain (Chorus) */}
        <Refrain 
          content={content.refrain} 
          audioPlayerRef={audioPlayerRef}
          onPlayChorusClick={() => setIsAudioPlayerOpen(true)}
        />

        {/* Poetic Devices */}
        <PoeticDevices content={content.poeticDevices} />

        {/* Musical Analysis */}
        <Suspense fallback={<MusicalAnalysisSkeleton />}>
          <MusicalAnalysis
            content={content.musicalAnalysis}
            audioElement={audioElementRef.current}
            isPlaying={isPlaying}
          />
        </Suspense>

        {/* Lyrics Explorer */}
        <LyricsExplorer content={content.lyrics} />

        {/* Credits & Sources */}
        <Footer content={content.credits} />
      </main>
    </div>
  );
}

// Loading skeletons for lazy-loaded components
function TimelineSkeleton() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto mb-16 animate-pulse" />
        <div className="space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}

function MusicalAnalysisSkeleton() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto mb-12 animate-pulse" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default App;

