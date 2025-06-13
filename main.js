const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { extractSections } = require('./extractUsage');
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-usage-options', async () => {
  const nimFile = path.join(__dirname, '../neverwinter.nim/nwn_gff.nim');
  return extractSections(nimFile);
});

ipcMain.handle('run-gff', async (event, args) => {
  // Use user-specified binary path or default to frontend folder
  const binDir = args.binPath && args.binPath.trim() ? args.binPath : __dirname;
  const binName = process.platform === 'win32' ? 'nwn_gff.exe' : 'nwn_gff';
  const binPath = path.join(binDir, binName);
  let cmdArgs = [];
  if (args.input) cmdArgs.push('-i', args.input);
  if (args.informat && args.informat !== 'autodetect') cmdArgs.push('-l', args.informat);
  if (args.output) cmdArgs.push('-o', args.output);
  if (args.outformat && args.outformat !== 'autodetect') cmdArgs.push('-k', args.outformat);
  if (args.inSqlite) cmdArgs.push('--in-sqlite', args.inSqlite);
  if (args.outSqlite) cmdArgs.push('--out-sqlite', args.outSqlite);
  if (args.pretty) cmdArgs.push('--pretty');
  // Add more options as needed

  try {
    const result = spawnSync(binPath, cmdArgs, { encoding: 'utf-8' });
    return result.stdout || result.stderr;
  } catch (err) {
    return 'Error running binary: ' + err.message;
  }
});

ipcMain.handle('show-open-dialog', async (event, opts) => {
  const win = BrowserWindow.getFocusedWindow();
  const result = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    ...opts
  });
  if (result.canceled || !result.filePaths.length) return '';
  return result.filePaths[0];
});

ipcMain.handle('show-save-dialog', async (event, opts) => {
  const win = BrowserWindow.getFocusedWindow();
  const result = await dialog.showSaveDialog(win, opts);
  if (result.canceled || !result.filePath) return '';
  return result.filePath;
});

ipcMain.handle('get-all-usages', async () => {
  // Read usages from pre-extracted JSON file
  const usagesPath = path.join(__dirname, 'tool_usages.json');
  console.log('Looking for tool_usages.json at:', usagesPath);
  if (fs.existsSync(usagesPath)) {
    const data = JSON.parse(fs.readFileSync(usagesPath, 'utf-8'));
    console.log('Loaded', data.length, 'usages from JSON file');
    return data;
  } else {
    console.log('tool_usages.json not found!');
    return [{ file: 'tool_usages.json', usage: '[tool_usages.json not found]', options: '' }];
  }
});

ipcMain.handle('run-tool', async (event, args) => {
  // Use user-specified binary path or default to frontend folder
  const binDir = args.binPath && args.binPath.trim() ? args.binPath : __dirname;
  const binName = process.platform === 'win32' ? `${args.tool}.exe` : args.tool;
  const binPath = path.join(binDir, binName);
  
  // Check if binary exists
  if (!fs.existsSync(binPath)) {
    throw new Error(`Binary not found: ${binPath}\nPlease check the binary path in settings.`);
  }
  
  let cmdArgs = [];
  
  // Add input file if provided
  if (args.input && args.input.trim()) {
    // Check if input file exists
    if (!fs.existsSync(args.input)) {
      throw new Error(`Input file not found: ${args.input}`);
    }
    cmdArgs.push(args.input);
  }
  
  // Add output file if provided  
  if (args.output && args.output.trim()) {
    // Check if output directory exists
    const outputDir = path.dirname(args.output);
    if (!fs.existsSync(outputDir)) {
      throw new Error(`Output directory not found: ${outputDir}`);
    }
    cmdArgs.push(args.output);
  }
  
  // Add any additional arguments
  if (args.args && args.args.trim()) {
    const additionalArgs = args.args.split(' ').filter(arg => arg.trim());
    cmdArgs.push(...additionalArgs);
  }

  try {
    console.log(`Running: ${binPath} ${cmdArgs.join(' ')}`);
    const result = spawnSync(binPath, cmdArgs, { 
      encoding: 'utf-8',
      timeout: 30000 // 30 second timeout
    });
    
    if (result.error) {
      throw new Error(`Execution failed: ${result.error.message}`);
    }
    
    if (result.status !== 0) {
      const errorMsg = result.stderr || `Command failed with exit code ${result.status}`;
      throw new Error(errorMsg);
    }
    
    return {
      success: true,
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      command: `${binPath} ${cmdArgs.join(' ')}`
    };
  } catch (err) {
    throw new Error(`Error running binary: ${err.message}`);
  }
});