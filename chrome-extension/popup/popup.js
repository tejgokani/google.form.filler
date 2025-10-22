// State
let API_BASE_URL = null;
let currentView = 'initial';
let numResponses = 1;

// DOM Elements
const views = {
  setup: document.getElementById('setupView'),
  initial: document.getElementById('initialView'),
  processing: document.getElementById('processingView'),
  results: document.getElementById('resultsView'),
  error: document.getElementById('errorView')
};

const elements = {
  // Setup elements
  setupUrl: document.getElementById('setupUrl'),
  testConnectionBtn: document.getElementById('testConnectionBtn'),
  connectionStatus: document.getElementById('connectionStatus'),
  
  // Main form elements
  formUrl: document.getElementById('formUrl'),
  numResponses: document.getElementById('numResponses'),
  userName: document.getElementById('userName'),
  userEmail: document.getElementById('userEmail'),
  decreaseBtn: document.getElementById('decreaseBtn'),
  increaseBtn: document.getElementById('increaseBtn'),
  fillFormBtn: document.getElementById('fillFormBtn'),
  resetBtn: document.getElementById('resetBtn'),
  retryBtn: document.getElementById('retryBtn'),
  
  // Progress elements
  progressFill: document.getElementById('progressFill'),
  progressText: document.getElementById('progressText'),
  statusMessage: document.getElementById('statusMessage'),
  
  // Results elements
  successCount: document.getElementById('successCount'),
  failedCount: document.getElementById('failedCount'),
  resultsList: document.getElementById('resultsList'),
  
  // Error elements
  errorMessage: document.getElementById('errorMessage'),
  
  // Footer elements
  apiUrlDisplay: document.getElementById('apiUrlDisplay'),
  reconfigureBtn: document.getElementById('reconfigureBtn')
};

// Initialize - Check if API URL is configured
async function initialize() {
  // Priority order for API URL detection:
  // 1. Stored URL (user configured)
  // 2. Config DEFAULT_API_URL (deployment configured)
  // 3. localhost:5000 (local development)
  // 4. Manual setup

  const stored = await new Promise((resolve) => {
    chrome.storage.local.get(['apiBaseUrl'], (result) => resolve(result.apiBaseUrl));
  });

  if (stored) {
    console.log('Testing stored URL:', stored);
    const isValid = await testConnection(stored, false);
    if (isValid) {
      API_BASE_URL = stored;
      updateApiUrlDisplay();
      showView('initial');
      return;
    }
  }

  // Try deployment-configured URL (from config.js)
  if (typeof CONFIG !== 'undefined' && CONFIG.DEFAULT_API_URL) {
    console.log('Testing configured URL:', CONFIG.DEFAULT_API_URL);
    const isValid = await testConnection(CONFIG.DEFAULT_API_URL, false);
    if (isValid) {
      API_BASE_URL = CONFIG.DEFAULT_API_URL;
      await chrome.storage.local.set({ apiBaseUrl: API_BASE_URL });
      updateApiUrlDisplay();
      showView('initial');
      return;
    }
  }

  // Try localhost for local development
  console.log('Testing localhost');
  const localhostWorks = await testConnection('http://localhost:5000', false);
  if (localhostWorks) {
    API_BASE_URL = 'http://localhost:5000';
    await chrome.storage.local.set({ apiBaseUrl: API_BASE_URL });
    updateApiUrlDisplay();
    showView('initial');
    return;
  }

  // Show setup screen for manual configuration
  console.log('No working URL found, showing setup screen');
  showView('setup');
}

// View Management
function showView(viewName) {
  Object.keys(views).forEach(key => {
    views[key].classList.add('hidden');
  });
  views[viewName].classList.remove('hidden');
  currentView = viewName;
}

// Test API connection
async function testConnection(url, showStatus = true) {
  if (showStatus) {
    elements.connectionStatus.textContent = 'Testing connection...';
    elements.connectionStatus.className = 'connection-status';
    elements.connectionStatus.classList.remove('hidden');
  }

  try {
    const response = await fetch(`${url}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.service === 'AI Google Form Filler') {
        if (showStatus) {
          elements.connectionStatus.textContent = '✓ Connection successful!';
          elements.connectionStatus.classList.add('success');
          
          // Save and proceed
          setTimeout(async () => {
            API_BASE_URL = url;
            await chrome.storage.local.set({ apiBaseUrl: url });
            updateApiUrlDisplay();
            showView('initial');
          }, 1000);
        }
        return true;
      }
    }
  } catch (error) {
    console.error('Connection test failed:', error);
  }

  if (showStatus) {
    elements.connectionStatus.textContent = '✗ Connection failed. Please check the URL and try again.';
    elements.connectionStatus.classList.add('error');
  }
  return false;
}

// Setup - Test Connection Button
elements.testConnectionBtn.addEventListener('click', async () => {
  const url = elements.setupUrl.value.trim();
  
  if (!url) {
    elements.connectionStatus.textContent = '✗ Please enter a URL';
    elements.connectionStatus.className = 'connection-status error';
    elements.connectionStatus.classList.remove('hidden');
    return;
  }

  try {
    new URL(url); // Validate URL format
  } catch (e) {
    elements.connectionStatus.textContent = '✗ Invalid URL format';
    elements.connectionStatus.className = 'connection-status error';
    elements.connectionStatus.classList.remove('hidden');
    return;
  }

  await testConnection(url, true);
});

// Reconfigure Button
elements.reconfigureBtn.addEventListener('click', (e) => {
  e.preventDefault();
  elements.setupUrl.value = API_BASE_URL || '';
  showView('setup');
});

// Update API URL Display
function updateApiUrlDisplay() {
  if (API_BASE_URL) {
    const displayUrl = API_BASE_URL.replace('http://', '').replace('https://', '');
    elements.apiUrlDisplay.textContent = `API: ${displayUrl}`;
  }
}

// Number Stepper
elements.decreaseBtn.addEventListener('click', () => {
  if (numResponses > 1) {
    numResponses--;
    elements.numResponses.value = numResponses;
    updateStepperButtons();
  }
});

elements.increaseBtn.addEventListener('click', () => {
  if (numResponses < 100) {
    numResponses++;
    elements.numResponses.value = numResponses;
    updateStepperButtons();
  }
});

function updateStepperButtons() {
  elements.decreaseBtn.disabled = numResponses <= 1;
  elements.increaseBtn.disabled = numResponses >= 100;
}

// Form Filling
elements.fillFormBtn.addEventListener('click', async () => {
  const formUrl = elements.formUrl.value.trim();
  
  if (!formUrl) {
    showError('Please enter a Google Form URL');
    return;
  }

  if (!formUrl.includes('docs.google.com/forms')) {
    showError('Please enter a valid Google Form URL');
    return;
  }

  await fillForm(formUrl);
});

async function fillForm(formUrl) {
  showView('processing');
  updateProgress(0, numResponses, 'Starting...');
  
  try {
    const requestData = {
      formUrl,
      numResponses,
      userData: {
        name: elements.userName.value.trim() || undefined,
        email: elements.userEmail.value.trim() || undefined
      },
      useAI: true
    };

    if (!requestData.userData.name && !requestData.userData.email) {
      delete requestData.userData;
    }

    const response = await fetch(`${API_BASE_URL}/api/fill-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fill form');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let finalResult = null;
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const messages = buffer.split('\n\n');
      buffer = messages.pop() || '';

      for (const message of messages) {
        if (message.startsWith('data: ')) {
          try {
            const eventData = JSON.parse(message.slice(6));

            if (eventData.type === 'status' || eventData.type === 'progress') {
              updateProgress(
                eventData.current || 0,
                eventData.total || numResponses,
                eventData.message || 'Processing...'
              );
            } else if (eventData.type === 'complete') {
              finalResult = eventData.data;
            } else if (eventData.type === 'error') {
              throw new Error(eventData.error);
            }
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }
    }

    if (buffer.trim() && buffer.startsWith('data: ')) {
      try {
        const eventData = JSON.parse(buffer.slice(6));
        if (eventData.type === 'complete') {
          finalResult = eventData.data;
        }
      } catch (e) {
        console.error('Error parsing final SSE:', e);
      }
    }

    if (finalResult) {
      showResults(finalResult);
    } else {
      throw new Error('No final results received from server');
    }
  } catch (error) {
    showError(error.message || 'An unexpected error occurred');
  }
}

function updateProgress(current, total, message) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  elements.progressFill.style.width = `${percentage}%`;
  elements.progressText.textContent = `${Math.round(percentage)}%`;
  elements.statusMessage.textContent = message;
}

function showResults(results) {
  elements.successCount.textContent = results.successCount;
  elements.failedCount.textContent = results.failedCount;
  
  elements.resultsList.innerHTML = '';
  results.submissions.forEach(submission => {
    const item = document.createElement('div');
    item.className = `result-item ${submission.success ? 'success' : 'error'}`;
    item.textContent = `Response #${submission.responseNumber}: ${submission.success ? 'Success' : submission.error}`;
    elements.resultsList.appendChild(item);
  });
  
  showView('results');
}

function showError(message) {
  elements.errorMessage.textContent = message;
  showView('error');
}

// Reset
elements.resetBtn.addEventListener('click', () => {
  showView('initial');
});

elements.retryBtn.addEventListener('click', () => {
  showView('initial');
});

// Try to auto-fill form URL from current tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0] && tabs[0].url && tabs[0].url.includes('docs.google.com/forms')) {
    elements.formUrl.value = tabs[0].url;
  }
});

// Start
initialize();
updateStepperButtons();
