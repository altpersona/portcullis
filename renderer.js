const { ipcRenderer } = require('electron');

let allTools = [];
let selectedTool = null;

function greyValueToHex(val) {
  // val: 2-15, returns hex string like #222222 to #FFFFFF
  const grey = Math.round((val / 15) * 255);
  const hex = grey.toString(16).padStart(2, '0');
  return `#${hex}${hex}${hex}`;
}

function getBackgroundClasses(greyVal) {
  // Return appropriate Tailwind classes based on grey value (2-5)
  // Secondary (inner) is always 2 shades lighter than primary (outer)
  if (greyVal <= 2) return { 
    primary: 'bg-gray-800', 
    secondary: 'bg-gray-600', // 2 shades lighter
    text: 'text-gray-100',
    border: 'border-gray-500'
  };
  if (greyVal <= 3) return { 
    primary: 'bg-gray-600', 
    secondary: 'bg-gray-400', // 2 shades lighter
    text: 'text-gray-100',
    border: 'border-gray-300'
  };
  if (greyVal <= 4) return { 
    primary: 'bg-gray-400', 
    secondary: 'bg-gray-200', // 2 shades lighter
    text: 'text-gray-800',
    border: 'border-gray-300'
  };
  // greyVal = 5
  return { 
    primary: 'bg-gray-200', 
    secondary: 'bg-white', // 2 shades lighter (gray-100 to white)
    text: 'text-gray-800',
    border: 'border-gray-200'
  };
}

function updateBackgroundClasses(greyVal) {
  const classes = getBackgroundClasses(greyVal);
  
  // Update body background using Tailwind classes instead of inline styles
  document.body.className = document.body.className.replace(/bg-gray-\d+/g, '').replace(/bg-white/g, '').trim();
  document.body.classList.add(classes.primary);
  
  // Update all dynamic background elements
  const primaryElements = document.querySelectorAll('[data-bg-primary]');
  primaryElements.forEach(el => {
    // Remove all existing bg-* classes and add the new one
    el.className = el.className.replace(/bg-gray-\d+/g, '').replace(/bg-white/g, '').trim();
    el.classList.add(classes.primary);
  });
  
  const secondaryElements = document.querySelectorAll('[data-bg-secondary]');
  secondaryElements.forEach(el => {
    // Remove all existing bg-* classes and add the new one  
    el.className = el.className.replace(/bg-gray-\d+/g, '').replace(/bg-white/g, '').trim();
    el.classList.add(classes.secondary);
  });
  
  // Also update text and border colors
  const allDynamicElements = document.querySelectorAll('[data-bg-primary], [data-bg-secondary]');
  allDynamicElements.forEach(el => {
    // Update text colors
    el.className = el.className.replace(/text-gray-\d+/g, '').trim();
    el.classList.add(classes.text);
    
    // Update border colors  
    el.className = el.className.replace(/border-gray-\d+/g, '').trim();
    el.classList.add(classes.border);
  });
  
  console.log('Updated backgrounds:', {
    greyVal,
    primaryCount: primaryElements.length,
    secondaryCount: secondaryElements.length,
    classes
  });
}

function parseToolOptions(optionsText) {
  if (!optionsText) return [];
  
  const lines = optionsText.split('\n');
  const options = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('$')) continue;
    
    // Match patterns like "-d", "--flag", "-f FILE", "--option VALUE"
    const match = trimmed.match(/^(-[a-zA-Z]|--[a-zA-Z-]+)(\s+[A-Z_]+)?/);
    if (match) {
      const flag = match[1];
      const hasValue = !!match[2];
      const description = trimmed.substring(match[0].length).trim();
      
      options.push({
        flag,
        hasValue,
        description,
        type: hasValue ? 'text' : 'checkbox'
      });
    }
  }
  
  return options;
}

function generateDynamicForm(tool) {
  if (!tool) return '';
  
  const greyVal = parseInt(localStorage.getItem('greyVal') || '3', 10);
  const classes = getBackgroundClasses(greyVal);
  
  const toolName = tool.file.replace('.nim', '');
  const options = parseToolOptions(tool.options);
  
  let formHTML = `
    <div class="max-w-4xl mx-auto p-6">
      <h2 class="text-2xl font-bold text-blue-600 mb-4">${toolName}</h2>
      <div class="${classes.secondary} border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg ${classes.border}" data-bg-secondary>
        <strong class="block text-sm font-semibold ${classes.text} mb-2">Usage:</strong>
        <pre class="text-sm font-mono ${classes.text} whitespace-pre-wrap">${tool.usage || 'No usage information'}</pre>
      </div>
      
      <form id="toolForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium ${classes.text} mb-2">Input File:</label>
            <div class="flex gap-2">              <input type="text" id="inputFile" 
                     class="flex-1 px-3 py-2 border ${classes.border} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${classes.secondary}" 
                     data-bg-secondary readonly placeholder="Choose an input file..." />
              <button type="button" id="inputBrowse" 
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Browse...
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium ${classes.text} mb-2">Output File:</label>
            <div class="flex gap-2">              <input type="text" id="outputFile" 
                     class="flex-1 px-3 py-2 border ${classes.border} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${classes.secondary}"
                     data-bg-secondary readonly placeholder="Choose an output file..." />
              <button type="button" id="outputBrowse" 
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Browse...
              </button>
            </div>
          </div>
        </div>
  `;
  
  // Add dynamic options based on parsed flags
  if (options.length > 0) {
    formHTML += '<div class="mb-4"><h3 class="text-lg font-semibold text-gray-800 mb-3">Options:</h3><div class="space-y-3">';
    
    for (const option of options) {
      if (option.type === 'checkbox') {
        formHTML += `
          <div class="${classes.secondary} border ${classes.border} rounded-lg p-4" data-bg-secondary>
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" id="opt_${option.flag.replace(/[^a-zA-Z0-9]/g, '_')}" 
                     class="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" /> 
              <span class="flex-1 text-sm">
                <strong class="${classes.text}">${option.flag}</strong> - ${option.description}
              </span>
            </label>
          </div>
        `;
      } else {
        formHTML += `
          <div class="${classes.secondary} border ${classes.border} rounded-lg p-4" data-bg-secondary>
            <label class="block text-sm font-medium ${classes.text} mb-2">
              <strong>${option.flag}</strong>: ${option.description}
            </label>            <input type="text" id="opt_${option.flag.replace(/[^a-zA-Z0-9]/g, '_')}" 
                   class="w-full px-3 py-2 border ${classes.border} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${classes.secondary}" 
                   data-bg-secondary placeholder="Enter value for ${option.flag}" />
          </div>
        `;
      }
    }
    formHTML += '</div></div>';
  }
  
  formHTML += `
        <div>
          <label class="block text-sm font-medium ${classes.text} mb-2">Additional Arguments:</label>          <input type="text" id="additionalArgs" 
                 class="w-full px-3 py-2 border ${classes.border} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${classes.secondary}" 
                 data-bg-secondary placeholder="Any additional command line arguments (optional)" />        </div>
          <div class="flex gap-3 flex-col sm:flex-row">
          <button type="submit" 
                  class="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            Run ${toolName}
          </button>
          <button type="button" id="helpButton"
                  class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
            Show Help
          </button>
          <button type="button" id="clearButton"
                  class="px-4 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors">
            Clear
          </button>
        </div>
      </form>
      
      <div id="result" 
           class="${classes.secondary} mt-6 p-4 border ${classes.border} rounded-lg min-h-20 font-mono text-sm whitespace-pre-wrap" data-bg-secondary>
        Ready to execute command...
      </div>
    </div>
  `;
  
  return formHTML;
}

window.onload = async () => {
  // Load slider value from localStorage or default to 3 (mid-grey)
  let greyVal = parseInt(localStorage.getItem('greyVal') || '3', 10);
  if (greyVal < 2) greyVal = 2;
  if (greyVal > 5) greyVal = 5;
  
  // Initialize background classes properly
  updateBackgroundClasses(greyVal);

  // Load all tool usages for the dropdown
  try {
    allTools = await ipcRenderer.invoke('get-all-usages');
    console.log('Loaded', allTools.length, 'tools');
  } catch (error) {
    console.error('Failed to load tools:', error);
    allTools = [];
  }

  const classes = getBackgroundClasses(greyVal);
  document.getElementById('output').innerHTML = `
    <div class="min-h-screen p-6 ${classes.primary}" data-bg-primary>
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8 ${classes.text}">Portcullis</h1>
        
        <div class="${classes.secondary} p-6 rounded-lg shadow-sm border ${classes.border} mb-8" data-bg-secondary>
          <label class="block text-lg font-medium ${classes.text} mb-3">Select Tool:</label>          <select id="toolSelector" 
                  class="w-full max-w-md px-4 py-2 border ${classes.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${classes.secondary}"
                  data-bg-secondary>
            <option value="">-- Choose a CLI Tool --</option>
            ${allTools.map(tool => {
              const toolName = tool.file.replace('.nim', '');
              return `<option value="${toolName}">${toolName}</option>`;
            }).join('')}
          </select>
        </div>
        
        <div id="toolInterface">
          <div class="${classes.secondary} p-8 rounded-lg text-center text-gray-600 border ${classes.border}" data-bg-secondary>
            <div class="max-w-md mx-auto">
              <div class="text-4xl mb-4">🔧</div>
              <h3 class="text-lg font-medium mb-2 ${classes.text}">Select a Tool</h3>
              <p class="text-sm ${classes.text}">Choose a tool from the dropdown above to see its interface and usage information.</p>
            </div>
          </div>
        </div>
      </div>

      <button id="settingsBtn" 
              class="fixed top-4 right-4 p-2 text-2xl hover:bg-gray-100 rounded-lg transition-colors" 
              title="Settings">⚙️</button>
      
      <div id="settingsPanel" 
           class="hidden fixed top-16 right-6 z-50 ${classes.secondary} border ${classes.border} rounded-lg shadow-lg p-6 min-w-80" data-bg-secondary>
        <h3 class="text-lg font-semibold ${classes.text} mb-4">Settings</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium ${classes.text} mb-2">
              UI Background Grey Scale: <span id="greyValText" class="font-bold">${greyVal}</span>/5
            </label>
            <input type="range" id="greySlider" min="2" max="5" value="${greyVal}" 
                   class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" />
          </div>
          
          <div>
            <label class="block text-sm font-medium ${classes.text} mb-2">Binary Folder:</label>
            <div class="flex gap-2">              <input type="text" id="binPath" 
                     class="flex-1 px-3 py-2 border ${classes.border} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${classes.primary}" 
                     data-bg-primary value="${localStorage.getItem('binPath') || ''}" readonly />
              <button type="button" id="binPathBrowse" 
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Browse...
              </button>
            </div>
          </div>
        </div>
        
        <button id="closeSettings" 
                class="mt-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
          Close
        </button>
      </div>
    </div>
  `;
  // Tool selector change handler
  document.getElementById('toolSelector').onchange = (e) => {
    const toolName = e.target.value;
    if (!toolName) {
      const classes = getBackgroundClasses(greyVal);
      document.getElementById('toolInterface').innerHTML = `
        <div class="${classes.secondary} p-8 rounded-lg text-center text-gray-600 border ${classes.border}" data-bg-secondary>
          <div class="max-w-md mx-auto">
            <div class="text-4xl mb-4">🔧</div>
            <h3 class="text-lg font-medium mb-2 ${classes.text}">Select a Tool</h3>
            <p class="text-sm ${classes.text}">Choose a tool from the dropdown above to see its interface and usage information.</p>
          </div>
        </div>
      `;
      selectedTool = null;
      return;
    }
      selectedTool = allTools.find(tool => tool.file.replace('.nim', '') === toolName);
    if (selectedTool) {
      document.getElementById('toolInterface').innerHTML = generateDynamicForm(selectedTool);
      setupToolFormHandlers();
      // Apply current background classes to newly generated content
      updateBackgroundClasses(greyVal);
    }
  };

  // Settings panel logic
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const closeSettings = document.getElementById('closeSettings');
  settingsBtn.onclick = () => { settingsPanel.classList.toggle('hidden'); };
  closeSettings.onclick = () => { settingsPanel.classList.add('hidden'); };

  // Settings: grey scale slider
  const slider = document.getElementById('greySlider');
  const greyValText = document.getElementById('greyValText');
  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    greyVal = val;
    updateBackgroundClasses(val);
    greyValText.textContent = val;
    localStorage.setItem('greyVal', val);
  });

  // Settings: binary path
  document.getElementById('binPathBrowse').onclick = async () => {
    const folderPath = await ipcRenderer.invoke('show-open-dialog', { properties: ['openDirectory'] });
    if (folderPath) {
      document.getElementById('binPath').value = folderPath;
      localStorage.setItem('binPath', folderPath);
    }
  };
};

function setupToolFormHandlers() {
  // File dialogs for input/output
  const inputBrowse = document.getElementById('inputBrowse');
  const outputBrowse = document.getElementById('outputBrowse');
  
  if (inputBrowse) {
    inputBrowse.onclick = async () => {
      const filePath = await ipcRenderer.invoke('show-open-dialog', { properties: ['openFile'] });
      if (filePath) document.getElementById('inputFile').value = filePath;
    };
  }
  
  if (outputBrowse) {
    outputBrowse.onclick = async () => {
      const filePath = await ipcRenderer.invoke('show-save-dialog', {});
      if (filePath) document.getElementById('outputFile').value = filePath;
    };
  }

  // Help button handler
  const helpButton = document.getElementById('helpButton');
  if (helpButton) {
    helpButton.onclick = async () => {
      if (!selectedTool) return;
      
      const toolName = selectedTool.file.replace('.nim', '');
      const binPath = document.getElementById('binPath').value;
      
      if (!binPath.trim()) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
          <div class="text-red-600 mb-2">❌ Error</div>
          <div class="text-gray-800">Binary path is required. Please set it in Settings.</div>
        `;
        return;
      }
      
      const runArgs = {
        tool: toolName,
        binPath,
        input: '',
        output: '',
        args: '--help'
      };
      
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '<div class="text-blue-600">🔄 Getting help information...</div>';
      
      try {
        const result = await ipcRenderer.invoke('run-tool', runArgs);
        resultDiv.innerHTML = `
          <div class="text-green-600 mb-3 font-semibold">📖 Help for ${toolName}</div>
          <div class="text-sm font-mono p-3 bg-blue-50 border border-blue-200 rounded whitespace-pre-wrap">${result.stdout || result.stderr || 'No help information available'}</div>
        `;
      } catch (error) {        resultDiv.innerHTML = `
          <div class="text-red-600 mb-2">❌ Error getting help</div>
          <div class="text-sm font-mono p-3 bg-red-50 border border-red-200 rounded">${error.message}</div>
        `;
      }
    };
  }

  // Clear button handler
  const clearButton = document.getElementById('clearButton');
  if (clearButton) {
    clearButton.onclick = () => {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '<div class="text-gray-600">Ready to execute command...</div>';
    };
  }

  // Tool form submission
  const toolForm = document.getElementById('toolForm');
  if (toolForm) {
    toolForm.onsubmit = async (e) => {
      e.preventDefault();
      
      if (!selectedTool) return;
      
      const toolName = selectedTool.file.replace('.nim', '');
      const binPath = document.getElementById('binPath').value;
      const inputFile = document.getElementById('inputFile').value;
      const outputFile = document.getElementById('outputFile').value;
      const additionalArgs = document.getElementById('additionalArgs').value;
      
      // Input validation
      const validationErrors = [];
      
      if (!binPath.trim()) {
        validationErrors.push('Binary path is required. Please set it in Settings.');
      }
      
      // Check if tool requires input file (most do)
      if (!inputFile.trim() && !additionalArgs.includes('--help') && !additionalArgs.includes('-h')) {
        validationErrors.push('Input file is required for most tools.');
      }
      
      // Display validation errors if any
      if (validationErrors.length > 0) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
          <div class="text-red-600 mb-2">❌ Validation Error</div>
          <div class="text-gray-800">
            ${validationErrors.map(error => `• ${error}`).join('<br>')}
          </div>
        `;
        return;
      }
      
      // Collect all dynamic option values
      const options = parseToolOptions(selectedTool.options);
      let optionArgs = [];
      
      for (const option of options) {
        const inputId = `opt_${option.flag.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const input = document.getElementById(inputId);
        
        if (input) {
          if (option.type === 'checkbox' && input.checked) {
            optionArgs.push(option.flag);
          } else if (option.type === 'text' && input.value.trim()) {
            optionArgs.push(option.flag, input.value.trim());
          }
        }
      }
      
      // Build arguments string
      let args = optionArgs.join(' ');
      if (additionalArgs.trim()) {
        args += ' ' + additionalArgs.trim();
      }
      
      const runArgs = {
        tool: toolName,
        binPath,
        input: inputFile,
        output: outputFile,
        args
      };
      
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = `
        <div class="text-blue-600 mb-2">🔄 Running command...</div>
        <div class="text-sm text-gray-600 font-mono mb-2">Command: ${toolName} ${args || ''}</div>
      `;
      
      try {
        const result = await ipcRenderer.invoke('run-tool', runArgs);
        
        // Enhanced output display
        resultDiv.innerHTML = `
          <div class="text-green-600 mb-3 font-semibold">✅ Command completed successfully</div>
          <div class="text-sm text-gray-600 font-mono mb-3 p-2 bg-gray-100 rounded">
            Command: ${result.command || toolName}
          </div>
          ${result.stdout ? `
            <div class="mb-3">
              <div class="text-sm font-semibold text-gray-700 mb-1">Output:</div>
              <div class="text-sm font-mono p-3 bg-green-50 border border-green-200 rounded whitespace-pre-wrap">${result.stdout}</div>
            </div>
          ` : ''}
          ${result.stderr ? `
            <div class="mb-3">
              <div class="text-sm font-semibold text-gray-700 mb-1">Messages:</div>
              <div class="text-sm font-mono p-3 bg-yellow-50 border border-yellow-200 rounded whitespace-pre-wrap">${result.stderr}</div>
            </div>
          ` : ''}
          ${!result.stdout && !result.stderr ? '<div class="text-gray-600 text-sm">Command executed successfully (no output)</div>' : ''}
        `;
      } catch (error) {
        resultDiv.innerHTML = `
          <div class="text-red-600 mb-3 font-semibold">❌ Error occurred</div>
          <div class="text-sm font-mono p-3 bg-red-50 border border-red-200 rounded whitespace-pre-wrap">${error.message}</div>
          <div class="text-sm text-gray-600 mt-2">
            💡 Tips:
            <ul class="list-disc list-inside mt-1">
              <li>Check that the binary path is correct in Settings</li>
              <li>Ensure input files exist and are accessible</li>
              <li>Try running with --help flag for usage information</li>
            </ul>
          </div>
        `;
      }
    };
  }
}
