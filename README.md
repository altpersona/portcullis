# Portcullis

A modern, user-friendly GUI frontend for the Neverwinter.nim CLI tools collection.

## Features

- **Modern Interface**: Clean, responsive design with customizable grey scale themes
- **Complete Tool Coverage**: Supports all 24 Neverwinter.nim CLI tools
- **Easy Configuration**: Simple settings panel for binary paths and UI preferences
- **Enhanced Output**: Formatted command output with error handling and validation
- **Cross-Platform**: Available for Windows and Linux

## Supported Tools

This interface provides a GUI for the following Neverwinter.nim CLI tools:

- nwn_asm - Assembly language tools
- nwn_erf - ERF archive management
- nwn_gff - GFF file format tools
- nwn*key*\* - Key file operations (pack, unpack, shadows, transparent)
- nwn*resman*\* - Resource manager tools (cat, diff, extract, grep, pkg, stats)
- nwn_script_comp - Script compilation
- nwn*nwsync*\* - NWSync operations (fetch, print, prune, write)
- nwn_ssf - Sound Set File tools
- nwn_tlk - Talk table tools
- nwn_twoda - 2DA file tools
- And more!

## Installation

### Windows

1. Download the `Portcullis-Setup-1.0.0-beta.1.exe` installer
2. Run the installer and follow the setup wizard
3. Launch from the Start Menu or Desktop shortcut

### Linux

#### AppImage (Recommended)

1. Download `Portcullis-1.0.0-beta.1.AppImage`
2. Make it executable: `chmod +x Portcullis-1.0.0-beta.1.AppImage`
3. Run: `./Portcullis-1.0.0-beta.1.AppImage`

#### Debian/Ubuntu (.deb)

1. Download `portcullis_1.0.0-beta.1_amd64.deb`
2. Install: `sudo dpkg -i portcullis_1.0.0-beta.1_amd64.deb`
3. Run from applications menu or terminal: `portcullis`

## Getting Started

1. **Set Binary Path**: Click the Settings (⚙️) button and set the path to your Neverwinter.nim binaries
2. **Select Tool**: Choose a tool from the dropdown menu
3. **Configure Options**: Fill in input/output files and any additional options
4. **Run**: Click "Run [tool]" to execute, or "Show Help" for usage information

## Requirements

- The Neverwinter.nim CLI tools must be compiled and available on your system
- Input files in the appropriate formats for the selected tool

## Building from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/portcullis.git
cd portcullis/frontend

# Install dependencies
npm install

# Run in development
npm start

# Build for your platform
npm run build

# Build for all platforms
npm run build:all
```

## Version History

### v1.0.0-beta.1

- Initial beta release
- Complete tool coverage for all 24 Neverwinter.nim CLI tools
- Modern GUI with customizable grey scale themes
- Input validation and enhanced error handling
- Cross-platform support (Windows/Linux)

## Contributing

This is a beta release. Please report issues and provide feedback to help improve the tool.

## License

[Your chosen license here]

## Acknowledgments

- Built for the [Neverwinter.nim](https://github.com/niv/neverwinter.nim) project by niv
- Powered by Electron and Tailwind CSS
