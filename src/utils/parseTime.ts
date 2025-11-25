/**
 * Time string parser utility
 * Parses time strings in various formats (M:SS, MM:SS, H:MM:SS) to seconds
 */

/**
 * Parse time string to seconds
 * Supports formats: "M:SS", "MM:SS", "H:MM:SS", or just seconds as number/string
 * @param timeString - Time string to parse (e.g., "0:45", "1:23:45", "45")
 * @returns Time in seconds, or 0 if invalid
 */
export function parseTimeString(timeString: string): number {
  if (!timeString || typeof timeString !== 'string') {
    return 0;
  }

  // Try parsing as just a number (seconds)
  const asNumber = parseFloat(timeString);
  if (!isNaN(asNumber) && isFinite(asNumber)) {
    return Math.max(0, asNumber);
  }

  // Parse time formats: M:SS, MM:SS, H:MM:SS
  // Match pattern: (hours?):(minutes):(seconds)
  const timePatterns = [
    /^(\d+):(\d{2}):(\d{2})$/, // H:MM:SS
    /^(\d+):(\d{2})$/,         // M:SS or MM:SS
  ];

  for (const pattern of timePatterns) {
    const match = timeString.trim().match(pattern);
    if (match) {
      if (match.length === 4) {
        // H:MM:SS format
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);
        return hours * 3600 + minutes * 60 + seconds;
      } else if (match.length === 3) {
        // M:SS or MM:SS format
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        return minutes * 60 + seconds;
      }
    }
  }

  // If no pattern matches, return 0
  return 0;
}

