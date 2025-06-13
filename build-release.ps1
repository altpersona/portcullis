# Build script for Portcullis releases (PowerShell)
# This script builds both Windows and Linux distributions

Write-Host "🚀 Building Portcullis - Beta Release" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the frontend directory." -ForegroundColor Red
    exit 1
}

# Check if electron-builder is installed
$builderInstalled = npm list electron-builder 2>$null
if (-not $builderInstalled) {
    Write-Host "❌ Error: electron-builder not found. Installing..." -ForegroundColor Yellow
    npm install --save-dev electron-builder
}

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Build Windows version
Write-Host ""
Write-Host "🪟 Building Windows packages..." -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan
npm run build:win

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Windows build completed successfully" -ForegroundColor Green
}
else {
    Write-Host "❌ Windows build failed" -ForegroundColor Red
    exit 1
}

# Build Linux version
Write-Host ""
Write-Host "🐧 Building Linux packages..." -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Cyan
npm run build:linux

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Linux build completed successfully" -ForegroundColor Green
}
else {
    Write-Host "❌ Linux build failed" -ForegroundColor Red
    exit 1
}

# Show results
Write-Host ""
Write-Host "📦 Build Results:" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "Output directory: ./dist/" -ForegroundColor Yellow
Write-Host ""

if (Test-Path "dist") {
    Get-ChildItem -Path "dist" | Where-Object { $_.Extension -match '\.(exe|AppImage|deb|gz)$' } | Format-Table Name, Length, LastWriteTime
}

Write-Host ""
Write-Host "🎉 All builds completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Release checklist:" -ForegroundColor Yellow
Write-Host "- [ ] Test Windows installer" -ForegroundColor White
Write-Host "- [ ] Test Windows portable" -ForegroundColor White
Write-Host "- [ ] Test Linux AppImage" -ForegroundColor White
Write-Host "- [ ] Test Linux .deb package" -ForegroundColor White
Write-Host "- [ ] Update release notes" -ForegroundColor White
Write-Host "- [ ] Create GitHub release" -ForegroundColor White
Write-Host "- [ ] Upload all packages" -ForegroundColor White
