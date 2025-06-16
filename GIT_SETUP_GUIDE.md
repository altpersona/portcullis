# Git Repository Setup for Portcullis

## Recommended Repository Structure

Here's what should be committed to your Git repository:

### Essential Files to Include:

```
portcullis/
├── .gitignore                    # Ignore build artifacts and temp files
├── LICENSE                       # MIT License
├── README.md                     # Main project documentation
├── package.json                  # Project configuration and dependencies
├── package-lock.json            # Lock file for reproducible builds
├── main.js                       # Electron main process
├── renderer.js                   # Frontend application logic
├── index.html                    # Main application window
├── tool_usages.json             # Extracted tool information
├── extractUsagesToJson.js       # Tool extraction script
├── build-release.ps1            # Windows build script
└── build-release.sh             # Linux build script (if created)
```

### Files to EXCLUDE (already in .gitignore):

- `node_modules/` - Dependencies (installed via npm)
- `dist/` - Build output
- `*.backup.*`, `*_old.*`, `*_new.*` - Backup files
- IDE and temporary files

## Steps to Create Git Repository:

### 1. Initialize Repository

```bash
cd C:\Users\micro\Documents\Projects\nim_frontend\frontend
git init
git add .gitignore LICENSE README_GIT.md
git commit -m "Initial commit: Add license and gitignore"
```

### 2. Add Core Application Files

```bash
git add package.json package-lock.json
git add main.js renderer.js index.html
git add tool_usages.json extractUsagesToJson.js
git commit -m "Add core application files"
```

### 3. Add Build Scripts and Documentation

```bash
git add build-release.ps1
git add README.md  # Rename README_GIT.md to README.md first
git commit -m "Add build scripts and documentation"
```

### 4. Create GitHub Repository

1. Go to GitHub and create a new repository named "portcullis"
2. Don't initialize with README (you already have one)
3. Copy the remote URL

### 5. Connect and Push

```bash
git remote add origin https://github.com/yourusername/portcullis.git
git branch -M main
git push -u origin main
```

## Release Strategy:

### For Beta Releases:

1. **Tag the release:**

   ```bash
   git tag -a v1.0.0-beta.1 -m "Beta 1 release"
   git push origin v1.0.0-beta.1
   ```

2. **Create GitHub Release:**
   - Go to GitHub → Releases → Create new release
   - Select the tag v1.0.0-beta.1
   - Title: "Portcullis v1.0.0-beta.1 - Windows Beta"
   - Attach the built files from `dist/`:
     - `Portcullis Setup 1.0.0-beta.1.exe`
     - `Portcullis 1.0.0-beta.1.exe`

### Repository Configuration:

- **Description:** "A modern GUI frontend for Neverwinter.nim CLI tools"
- **Topics:** neverwinter, nim, cli, gui, electron, bioware, d&d
- **Homepage:** Your project website (if any)

## File Cleanup Recommendations:

Before committing, remove these development artifacts:

- All `*_backup.*`, `*_old.*`, `*_new.*` files
- `Untitled-*` files
- `const { app, BrowserWindow } = require('.txt`
- `frontend.working.backup.7z`
- Extra documentation files (keep only main README.md)

## Branch Strategy:

- `main` - Stable releases
- `develop` - Development work
- `feature/*` - Feature branches
- `release/*` - Release preparation

This structure gives you a clean, professional repository ready for open source development and community contributions.
