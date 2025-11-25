import { useEffect, useRef, useState } from 'react';

interface VisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

// Global map to track which audio elements have been connected to prevent duplicate connections
const connectedAudioElements = new WeakSet<HTMLAudioElement>();

export default function Visualizer({ audioElement, isPlaying }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const setupDoneRef = useRef<HTMLAudioElement | null>(null);
  const [hasAudioContext, setHasAudioContext] = useState(false);

  useEffect(() => {
    if (!audioElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup audio context and analyser (only once per audio element)
    const setupAudioContext = async () => {
      if (!audioElement) {
        setHasAudioContext(false);
        return;
      }

      // Check if this audio element has already been connected to a MediaElementSource
      if (connectedAudioElements.has(audioElement)) {
        // Already connected elsewhere - use demo animation
        setHasAudioContext(false);
        return;
      }

      // Check if we've already set up this element in this component instance
      if (setupDoneRef.current === audioElement && audioContextRef.current && analyserRef.current) {
        // Already set up, just ensure context is running
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        setHasAudioContext(true);
        return;
      }

      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        // Try to create source - this will throw if element already connected
        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        // Mark this element as connected
        connectedAudioElements.add(audioElement);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        sourceRef.current = source;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        audioContextRef.current = audioContext;
        setupDoneRef.current = audioElement;
        setHasAudioContext(true);
      } catch (error) {
        // Audio element already connected - gracefully handle and use demo
        if (error instanceof DOMException && error.name === 'InvalidStateError') {
          // Element already has a source - mark it and use demo animation
          connectedAudioElements.add(audioElement);
          setHasAudioContext(false);
        } else {
          console.warn('Audio context setup failed, using demo animation:', error);
          setHasAudioContext(false);
        }
        // Clean up any partial setup
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          try {
            audioContextRef.current.close();
          } catch (e) {
            // Ignore close errors
          }
        }
        audioContextRef.current = null;
        analyserRef.current = null;
        sourceRef.current = null;
      }
    };

    setupAudioContext();

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw function
    const draw = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      if (hasAudioContext && analyserRef.current && dataArrayRef.current && isPlaying) {
        // Create a new Uint8Array with explicit ArrayBuffer type for getByteFrequencyData
        const bufferLength = dataArrayRef.current.length;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barCount = 32;
        const barWidth = width / barCount;
        const data = dataArray;

        // Pablo Honey color palette for visualizer
        const colors = ['#F2A704', '#EAC986', '#C77017', '#6484AC'];
        
        for (let i = 0; i < barCount; i++) {
          const barIndex = Math.floor((i / barCount) * data.length);
          const barHeight = (data[barIndex] / 255) * height * 0.8;

          // Cycle through Pablo Honey colors
          const colorIndex = Math.floor((i / barCount) * colors.length);
          ctx.fillStyle = colors[colorIndex];
          ctx.fillRect(
            i * barWidth + barWidth * 0.1,
            height - barHeight,
            barWidth * 0.8,
            barHeight
          );
        }
      } else {
        // Demo animation when no audio context or not playing
        const time = Date.now() * 0.001;
        const barCount = 32;
        const barWidth = width / barCount;

        // Pablo Honey color palette for demo animation
        const colors = ['#F2A704', '#EAC986', '#C77017', '#6484AC'];
        
        for (let i = 0; i < barCount; i++) {
          const offset = i * 0.3;
          const barHeight = (Math.sin(time * 2 + offset) * 0.5 + 0.5) * height * 0.6;
          
          // Cycle through Pablo Honey colors
          const colorIndex = Math.floor((i / barCount) * colors.length);
          ctx.fillStyle = colors[colorIndex];
          ctx.fillRect(
            i * barWidth + barWidth * 0.1,
            height - barHeight,
            barWidth * 0.8,
            barHeight
          );
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Note: We don't close the audio context here because the audio element
      // is managed by the AudioPlayer component. The context will be reused
      // if the same element is passed again.
    };
  }, [audioElement, isPlaying]);

  return (
    <div className="w-full h-32 bg-gray-900 dark:bg-black rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
        aria-label="Audio visualizer"
      />
    </div>
  );
}

