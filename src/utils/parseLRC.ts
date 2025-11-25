/**
 * LRC (Lyrics) file parser
 * Parses standard LRC format: [MM:SS.mm]lyrics text
 */

export interface LyricLine {
  time: number; // Time in seconds
  text: string; // Lyric text
}

/**
 * Parse LRC file content into array of lyric lines with timestamps
 * @param lrcContent - Raw LRC file content as string
 * @returns Array of lyric lines sorted by time
 */
export function parseLRC(lrcContent: string): LyricLine[] {
  const lines: LyricLine[] = [];
  
  // Split by newlines and process each line
  const rawLines = lrcContent.split(/\r?\n/);
  
  for (const line of rawLines) {
    // Match timestamp pattern: [MM:SS.mm] or [MM:SS:mm]
    const timestampRegex = /\[(\d{2}):(\d{2})\.(\d{2})\]/;
    const match = line.match(timestampRegex);
    
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const centiseconds = parseInt(match[3], 10);
      
      // Convert to total seconds
      const timeInSeconds = minutes * 60 + seconds + centiseconds / 100;
      
      // Extract text after timestamp
      const text = line.replace(timestampRegex, '').trim();
      
      // Only add if there's text (some lines might be empty timestamps)
      if (text || lines.length === 0) {
        lines.push({
          time: timeInSeconds,
          text: text || '', // Allow empty lines for spacing
        });
      }
    }
  }
  
  // Sort by time to ensure correct order
  return lines.sort((a, b) => a.time - b.time);
}

/**
 * Find the current active lyric line based on current time
 * @param lyrics - Array of lyric lines
 * @param currentTime - Current playback time in seconds
 * @returns Index of the active line, or -1 if none
 */
export function findActiveLyric(lyrics: LyricLine[], currentTime: number): number {
  if (lyrics.length === 0 || currentTime < lyrics[0].time) {
    return -1;
  }
  
  // Find the last lyric line that has started (time <= currentTime)
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (lyrics[i].time <= currentTime) {
      // Check if there's a next line, and if current time is before it
      if (i === lyrics.length - 1 || currentTime < lyrics[i + 1].time) {
        return i;
      }
    }
  }
  
  return -1;
}

