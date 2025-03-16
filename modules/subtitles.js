/**
 * Subtitles module - Handles fetching and parsing YouTube subtitles
 */

// Function to extract video ID from YouTube URL
function extractVideoId(url) {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get('v');
}

// Function to fetch subtitles for a YouTube video
async function fetchSubtitles(videoId) {
  try {
    // First, we need to get the available caption tracks
    const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const videoPageHtml = await videoPageResponse.text();
    
    // Extract the caption tracks information
    // This is a simplified approach - YouTube's actual data structure is more complex
    // and may change over time
    let captionTracks = [];
    
    try {
      // Try to extract caption data from the page
      const captionDataMatch = videoPageHtml.match(/"captionTracks":\s*(\[.*?\])/);
      if (captionDataMatch && captionDataMatch[1]) {
        captionTracks = JSON.parse(captionDataMatch[1]);
      }
    } catch (e) {
      console.error('Error parsing caption tracks:', e);
      return { error: 'Failed to parse caption data' };
    }
    
    // If no caption tracks are found
    if (captionTracks.length === 0) {
      return { error: 'No captions available for this video' };
    }
    
    // Prefer English captions, but fall back to the first available track
    let selectedTrack = captionTracks.find(track => 
      track.languageCode === 'en' || track.name?.simpleText?.includes('English')
    ) || captionTracks[0];
    
    if (!selectedTrack || !selectedTrack.baseUrl) {
      return { error: 'No valid caption track found' };
    }
    
    // Fetch the actual captions
    const captionsResponse = await fetch(selectedTrack.baseUrl);
    const captionsXml = await captionsResponse.text();
    
    // Parse the XML to extract caption text and timestamps
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(captionsXml, 'text/xml');
    const textElements = xmlDoc.getElementsByTagName('text');
    
    const captions = [];
    for (let i = 0; i < textElements.length; i++) {
      const element = textElements[i];
      const start = parseFloat(element.getAttribute('start'));
      const duration = parseFloat(element.getAttribute('dur') || '0');
      const text = element.textContent;
      
      captions.push({
        start,
        end: start + duration,
        text: text.trim()
      });
    }
    
    return { captions, language: selectedTrack.languageCode || 'unknown' };
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    return { error: 'Failed to fetch subtitles: ' + error.message };
  }
}

// Function to get current video subtitles
async function getCurrentVideoSubtitles() {
  const videoId = extractVideoId(window.location.href);
  if (!videoId) {
    return { error: 'Could not extract video ID from URL' };
  }
  
  return await fetchSubtitles(videoId);
}

// Export the module functions
export {
  extractVideoId,
  fetchSubtitles,
  getCurrentVideoSubtitles
};
