// We'll load the modules dynamically
let subtitlesModule;
let uiModule;

// Load the modules using the import() function
async function loadModules() {
  subtitlesModule = await import('./modules/subtitles.js');
  uiModule = await import('./modules/ui.js');
}

// Flag to track if modules are loaded
let modulesLoaded = false;

// Load modules immediately
loadModules().then(() => {
  modulesLoaded = true;
  // Initialize the extension once modules are loaded
  waitForYouTubeAndAddExtension();
});

// Function to create and add the extension island to YouTube video pages
function addExtensionToYouTube() {
  // Check if we're on YouTube
  if (!window.location.hostname.includes('youtube.com')) {
    return;
  }
  
  // Check if we're on a video watch page
  if (!window.location.pathname.includes('/watch')) {
    return;
  }
  
  // Check if our extension island already exists to avoid duplicates
  if (document.getElementById('youtube-extension-island')) {
    // If it exists but is not visible (YouTube might have recreated the DOM),
    // we should remove it and create a new one
    const existingIsland = document.getElementById('youtube-extension-island');
    if (!document.body.contains(existingIsland) || existingIsland.offsetParent === null) {
      existingIsland.remove();
    } else {
      return; // Island exists and is visible, no need to recreate
    }
  }
  
  // Create the extension island container
  const extensionIsland = document.createElement('div');
  extensionIsland.id = 'youtube-extension-island';
  extensionIsland.className = 'youtube-extension-island';
  
  // Create the title for the extension island
  const title = document.createElement('div');
  title.className = 'youtube-extension-title';
  title.textContent = 'AI UGC Video Script';
  extensionIsland.appendChild(title);
  
  // Create the buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'youtube-extension-buttons';
  
  // Create the "Create Hook" button
  const hookButton = document.createElement('button');
  hookButton.className = 'youtube-extension-btn hook-btn';
  hookButton.textContent = 'Create Hook';
  hookButton.addEventListener('click', function() {
    alert('Create Hook functionality will be implemented here!');
  });
  buttonsContainer.appendChild(hookButton);
  
  // Create subtitle container (initially hidden)
  const subtitleContainer = document.createElement('div');
  subtitleContainer.className = 'youtube-extension-subtitle-container';
  subtitleContainer.style.display = 'none';
  subtitleContainer.style.transition = 'max-height 0.3s ease-in-out';
  subtitleContainer.style.overflow = 'auto';
  
  // Create the "Create Short Script" button
  const scriptButton = document.createElement('button');
  scriptButton.className = 'youtube-extension-btn script-btn';
  scriptButton.textContent = 'Create Short Script';
  
  // Flag to track if subtitles are currently visible
  let subtitlesVisible = false;
  
  // Add click event listener for the script button
  scriptButton.addEventListener('click', async function() {
    // Toggle subtitle visibility
    subtitlesVisible = !subtitlesVisible;
    
    if (subtitlesVisible) {
      // Show the subtitle container
      uiModule.toggleContainerVisibility(subtitleContainer, true);
      
      // Show loading spinner
      subtitleContainer.innerHTML = '';
      subtitleContainer.appendChild(uiModule.createLoadingSpinner());
      
      // Fetch subtitles
      const subtitleData = await subtitlesModule.getCurrentVideoSubtitles();
      
      // Display subtitles
      uiModule.displaySubtitles(subtitleContainer, subtitleData);
    } else {
      // Hide the subtitle container
      uiModule.toggleContainerVisibility(subtitleContainer, false);
    }
  });
  
  buttonsContainer.appendChild(scriptButton);
  
  // Add the buttons container to the island
  extensionIsland.appendChild(buttonsContainer);
  
  // Add the subtitle container to the island
  extensionIsland.appendChild(subtitleContainer);
  
  // Function to insert the extension island above the right sidebar
  function insertExtensionIsland() {
    // Try multiple selectors to find the right sidebar in YouTube's layout
    // YouTube's structure can vary, so we try several common selectors
    const rightSidebar = document.querySelector('#secondary, #secondary-inner, ytd-watch-flexy #secondary');
    
    if (rightSidebar) {
      // If we found the sidebar, insert our island at the top of it
      rightSidebar.insertBefore(extensionIsland, rightSidebar.firstChild);
      return true;
    }
    
    // Fallback: try to find the main content and secondary content layout
    const primaryContent = document.querySelector('#primary, #primary-inner, ytd-watch-flexy #primary');
    if (primaryContent && primaryContent.nextElementSibling) {
      // The secondary content is typically the next sibling after the primary content
      const secondaryContent = primaryContent.nextElementSibling;
      secondaryContent.insertBefore(extensionIsland, secondaryContent.firstChild);
      return true;
    }
    
    return false;
  }
  
  // Try to insert the extension island
  if (!insertExtensionIsland()) {
    // If we couldn't insert it immediately, try again when more elements load
    const observer = new MutationObserver(function(mutations) {
      if (insertExtensionIsland()) {
        observer.disconnect();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Function to check if the YouTube page is fully loaded
function isYouTubeReady() {
  // Check for key YouTube elements that indicate the page is ready
  return document.querySelector('#primary') !== null && 
         document.querySelector('#secondary') !== null;
}

// Function to wait for YouTube to be ready and then add our extension
function waitForYouTubeAndAddExtension() {
  // Make sure modules are loaded first
  if (!modulesLoaded) {
    // If modules aren't loaded yet, wait for them
    setTimeout(waitForYouTubeAndAddExtension, 100);
    return;
  }

  if (isYouTubeReady()) {
    addExtensionToYouTube();
    return;
  }
  
  // If YouTube isn't ready yet, check again after a short delay
  setTimeout(waitForYouTubeAndAddExtension, 500);
}

// Run our function when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // waitForYouTubeAndAddExtension will be called after modules are loaded
});

// Also run when the URL changes (for single-page app navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Small delay to ensure YouTube has updated its DOM
    if (modulesLoaded) {
      setTimeout(waitForYouTubeAndAddExtension, 1000);
    }
  }
}).observe(document, {subtree: true, childList: true});

// Initial run is now handled by the loadModules().then() callback
