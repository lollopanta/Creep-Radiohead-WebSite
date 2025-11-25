export interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
  };
  band: {
    name: string;
    image: string;
    description: string;
  };
  album: {
    name: string;
    cover: string;
    year: string;
    label: string;
    description: string;
  };
  songHistory: {
    title: string;
    timeline: Array<{
      year: string;
      title: string;
      description: string;
    }>;
  };
  structure: {
    title: string;
    stanzaCount: string;
    stanzas: Array<{
      name: string;
      meter: string;
      syllableCount: string;
      description: string;
    }>;
    diagramImage: string;
  };
  refrain: {
    title: string;
    lyrics: string;
    startTime: string;
    description: string;
  };
  poeticDevices: {
    title: string;
    metaphors: {
      title: string;
      examples: Array<{
        line: string;
        explanation: string;
      }>;
    };
    hyperbole: {
      title: string;
      examples: Array<{
        line: string;
        explanation: string;
      }>;
    };
    personification: {
      title: string;
      examples: Array<{
        line: string;
        explanation: string;
      }>;
    };
    assonance: {
      title: string;
      examples: Array<{
        line: string;
        explanation: string;
      }>;
    };
    alliteration: {
      title: string;
      examples: Array<{
        line: string;
        explanation: string;
      }>;
    };
  };
  musicalAnalysis: {
    title: string;
    tempo: {
      label: string;
      value: string;
      placeholder: number;
    };
    chordProgression: {
      label: string;
      chords: string[];
    };
    key: string;
  };
  lyrics: {
    title: string;
    stanzas: Array<{
      name: string;
      content: string;
    }>;
  };
  credits: {
    title: string;
    description: string;
    sources: Array<{
      title: string;
      url: string;
      description: string;
    }>;
  };
  audio: {
    path: string;
  };
}

export interface AudioPlayerRef {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  isPlaying: () => boolean;
  getAudioElement: () => HTMLAudioElement | null;
}

