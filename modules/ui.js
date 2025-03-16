/**
 * UI module - Handles creating and managing UI components for the extension
 */

// Function to create a loading spinner element
function createLoadingSpinner() {
  const spinner = document.createElement('div');
  spinner.className = 'youtube-extension-spinner';
  
  for (let i = 0; i < 4; i++) {
    const dot = document.createElement('div');
    dot.className = 'spinner-dot';
    spinner.appendChild(dot);
  }
  
  return spinner;
}

// Function to create a subtitle display container
function createSubtitleContainer() {
  const container = document.createElement('div');
  container.className = 'youtube-extension-subtitle-container';
  return container;
}

// Function to display subtitles in the container
function displaySubtitles(container, subtitleData) {
  // Clear any existing content
  container.innerHTML = '';
  
  if (subtitleData.error) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'youtube-extension-error';
    errorMessage.textContent = subtitleData.error;
    container.appendChild(errorMessage);
    return;
  }
  
  if (!subtitleData.captions || subtitleData.captions.length === 0) {
    const noSubtitles = document.createElement('div');
    noSubtitles.className = 'youtube-extension-message';
    noSubtitles.textContent = 'No subtitles available for this video.';
    container.appendChild(noSubtitles);
    return;
  }
  
  // Create a subtitle list
  const subtitleList = document.createElement('div');
  subtitleList.className = 'youtube-extension-subtitle-list';
  
  // Add each caption as a separate element
  subtitleData.captions.forEach((caption, index) => {
    const captionElement = document.createElement('div');
    captionElement.className = 'youtube-extension-caption';
    
    // Format timestamp (convert seconds to MM:SS format)
    const minutes = Math.floor(caption.start / 60);
    const seconds = Math.floor(caption.start % 60);
    const timestamp = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Create timestamp element
    const timestampElement = document.createElement('span');
    timestampElement.className = 'youtube-extension-timestamp';
    timestampElement.textContent = timestamp;
    
    // Create text element
    const textElement = document.createElement('span');
    textElement.className = 'youtube-extension-caption-text';
    textElement.textContent = caption.text;
    
    // Add timestamp and text to caption element
    captionElement.appendChild(timestampElement);
    captionElement.appendChild(textElement);
    
    // Add click handler to jump to that timestamp in the video
    captionElement.addEventListener('click', () => {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.currentTime = caption.start;
      }
    });
    
    subtitleList.appendChild(captionElement);
  });
  
  container.appendChild(subtitleList);
  
  // Add a "Generate Script" button at the bottom
  const generateButton = document.createElement('button');
  generateButton.className = 'youtube-extension-btn generate-btn';
  generateButton.textContent = 'Generate Script';
  generateButton.addEventListener('click', () => {
    alert('Script generation functionality will be implemented here!');
  });
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'youtube-extension-button-container';
  buttonContainer.appendChild(generateButton);
  
  container.appendChild(buttonContainer);
}

// Function to toggle the visibility of a container
function toggleContainerVisibility(container, isVisible) {
  if (isVisible) {
    container.style.display = 'block';
    container.style.maxHeight = '400px'; // Set a reasonable max height
  } else {
    container.style.display = 'none';
    container.style.maxHeight = '0';
  }
}

// Export the module functions
export {
  createLoadingSpinner,
  createSubtitleContainer,
  displaySubtitles,
  toggleContainerVisibility
};
