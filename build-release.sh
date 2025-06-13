#!/bin/bash
# Build script for Neverwinter.nim GUI releases
# This script builds both Windows and Linux distributions

echo "🚀 Building Neverwinter.nim CLI Tool Interface - Beta Release"
echo "============================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Check if electron-builder is installed
if ! npm list electron-builder &>/dev/null; then
    echo "❌ Error: electron-builder not found. Installing..."
    npm install --save-dev electron-builder
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Build Windows version
echo ""
echo "🪟 Building Windows packages..."
echo "--------------------------------"
npm run build:win

if [ $? -eq 0 ]; then
    echo "✅ Windows build completed successfully"
else
    echo "❌ Windows build failed"
    exit 1
fi

# Build Linux version
echo ""
echo "🐧 Building Linux packages..."
echo "------------------------------"
npm run build:linux

if [ $? -eq 0 ]; then
    echo "✅ Linux build completed successfully"
else
    echo "❌ Linux build failed"
    exit 1
fi

# Show results
echo ""
echo "📦 Build Results:"
echo "=================="
echo "Output directory: ./dist/"
echo ""
ls -la dist/ | grep -E '\.(exe|AppImage|deb|tar\.gz)$'

echo ""
echo "🎉 All builds completed successfully!"
echo ""
echo "📋 Release checklist:"
echo "- [ ] Test Windows installer"
echo "- [ ] Test Windows portable"
echo "- [ ] Test Linux AppImage"
echo "- [ ] Test Linux .deb package"
echo "- [ ] Update release notes"
echo "- [ ] Create GitHub release"
echo "- [ ] Upload all packages"
