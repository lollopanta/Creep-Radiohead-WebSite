import { useEffect, useRef, useState } from 'react';

interface VisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

// Global shared AudioContext and source mapping
// This allows multiple visualizers to share the same audio source
const globalAudioContext = new Map<HTMLAudioElement, {
  context: AudioContext;
  analyser: AnalyserNode;
  source: MediaElementAudioSourceNode;
}>();

export default function Visualizer({ audioElement, isPlaying }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [hasAudioContext, setHasAudioContext] = useState(false);

  // Setup audio context and analyser
  useEffect(() => {
    if (!audioElement || !canvasRef.current) {
      setHasAudioContext(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;

    // Check if we already have a global context for this audio element
    const existingConnection = globalAudioContext.get(audioElement);
    
    if (existingConnection) {
      // Reuse existing connection
      analyser = existingConnection.analyser;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      setHasAudioContext(true);
      
      // Ensure context is running
      if (existingConnection.context.state === 'suspended') {
        existingConnection.context.resume();
      }
    } else {
      // Create new connection
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512; // Higher FFT size for better frequency resolution
        analyser.smoothingTimeConstant = 0.8; // Smooth transitions
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;

        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // Store in global map
        globalAudioContext.set(audioElement, {
          context: audioContext,
          analyser,
          source,
        });

        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        setHasAudioContext(true);
        
        // Resume context if suspended (browser autoplay policy)
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      } catch (error) {
        console.error('Failed to setup audio visualizer:', error);
        setHasAudioContext(false);
      }
    }

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw function - continuously updates the visualization
    const draw = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      if (hasAudioContext && analyserRef.current && dataArrayRef.current && audioElement) {
        // Get frequency data from the audio analyser
        // Create a new array to avoid TypeScript type issues
        const bufferLength = dataArrayRef.current.length;
        const frequencyData = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(frequencyData);
        const data = frequencyData;
        
        // Only visualize if audio is actually playing and not muted
        const shouldVisualize = isPlaying && !audioElement.muted && audioElement.volume > 0;

        // Pablo Honey color palette for visualizer
        const colors = ['#F2A704', '#EAC986', '#C77017', '#6484AC', '#CFC2B6'];
        
        const barCount = 64; // More bars for better detail
        const barWidth = width / barCount;
        const gap = barWidth * 0.1;

        // Draw frequency bars
        for (let i = 0; i < barCount; i++) {
          // Map bar index to frequency data (logarithmic scaling for better visualization)
          const dataIndex = Math.floor(Math.pow(i / barCount, 0.7) * data.length);
          let normalizedValue = data[dataIndex] / 255;
          
          // Scale based on volume
          normalizedValue = normalizedValue * audioElement.volume;
          
          // Apply dynamic scaling based on playback state
          let barHeight = normalizedValue * height;
          
          if (!shouldVisualize) {
            // Fade out when paused/muted
            barHeight = barHeight * 0.2;
          } else if (normalizedValue > 0.05) {
            // Add minimum height when playing to show activity
            barHeight = Math.max(barHeight, height * 0.03);
          }
          
          // Choose color based on frequency band
          const colorIndex = Math.floor((i / barCount) * colors.length) % colors.length;
          const baseColor = colors[colorIndex];
          
          // Draw bar with rounded corners effect
          const x = i * barWidth + gap;
          const y = height - barHeight;
          const w = barWidth - gap * 2;
          const h = barHeight;
          
          // Add gradient overlay for depth
          if (h > 2) {
            const gradient = ctx.createLinearGradient(x, y, x, y + h);
            const opacity = shouldVisualize ? 'FF' : '40';
            gradient.addColorStop(0, `${baseColor}80`);
            gradient.addColorStop(0.5, `${baseColor}${opacity}`);
            gradient.addColorStop(1, `${baseColor}CC`);
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, w, h);
          }
        }
      } else {
        // Demo animation when no audio context or not playing
        const time = Date.now() * 0.001;
        const barCount = 64;
        const barWidth = width / barCount;
        const gap = barWidth * 0.1;

        const colors = ['#F2A704', '#EAC986', '#C77017', '#6484AC', '#CFC2B6'];
        
        for (let i = 0; i < barCount; i++) {
          const offset = i * 0.15;
          const normalizedValue = (Math.sin(time * 2 + offset) * 0.5 + 0.5);
          const barHeight = normalizedValue * height * 0.6;
          
          const colorIndex = Math.floor((i / barCount) * colors.length) % colors.length;
          ctx.fillStyle = colors[colorIndex];
          
          const x = i * barWidth + gap;
          const y = height - barHeight;
          const w = barWidth - gap * 2;
          const h = barHeight;
          
          ctx.fillRect(x, y, w, h);
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
      // Note: We don't clean up the global audio context here because
      // it might be used by other visualizers. Cleanup will happen when
      // the audio element is removed or the page unloads.
    };
  }, [audioElement, isPlaying, hasAudioContext]);

  return (
    <div className="w-full h-32 bg-gray-900 dark:bg-black rounded-lg overflow-hidden relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
        aria-label="Audio visualizer showing real-time frequency spectrum"
      />
      {!hasAudioContext && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          Waiting for audio...
        </div>
      )}
    </div>
  );
}
