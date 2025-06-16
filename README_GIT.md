# Portcullis

A modern GUI frontend for Neverwinter.nim CLI tools, providing an intuitive interface for interacting with BioWare game assets.

## Features

- **Modern UI**: Clean, responsive interface built with Electron and Tailwind CSS
- **Tool Discovery**: Automatically detects and displays available CLI tools
- **Intelligent Forms**: Dynamically generates input forms based on tool requirements
- **Real-time Execution**: Run tools with live output display
- **Settings Management**: Configure binary paths and UI preferences
- **Cross-platform**: Available for Windows and Linux

## Installation

### Windows

1. Download `Portcullis Setup 1.0.0-beta.1.exe` from the releases
2. Run the installer and follow the setup wizard
3. Launch Portcullis from the Start Menu or Desktop

### Linux

1. Download `Portcullis-1.0.0-beta.1.AppImage` from the releases
2. Make it executable: `chmod +x Portcullis-1.0.0-beta.1.AppImage`
3. Run: `./Portcullis-1.0.0-beta.1.AppImage`

## Development

### Prerequisites

- Node.js 14+ and npm
- Git

### Setup

```bash
git clone https://github.com/yourusername/portcullis.git
cd portcullis
npm install
```

### Running in Development

```bash
npm start
```

### Building

```bash
# Build for current platform
npm run build

# Build for Windows
npm run build:win

# Build for Linux
npm run build:linux

# Build for all platforms
npm run build:all
```

## Configuration

On first launch, configure:

1. **Binary Path**: Path to your neverwinter.nim CLI tools
2. **UI Settings**: Adjust theme and display preferences

## Supported Tools

Portcullis supports all 24 CLI tools from the neverwinter.nim project:

- nwn_gff, nwn_erf, nwn_key_pack, nwn_tlk, nwn_ssf
- nwn_resman, nwn_twoda, nwn_palette, nwn_compressedbuf
- And many more...

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Related Projects

- [neverwinter.nim](https://github.com/niv/neverwinter.nim) - The CLI tools this GUI interfaces with
- [Neverwinter Nights](https://www.beamdog.com/games/neverwinter-nights-enhanced-edition/) - The game these tools support

## Support

For issues and feature requests, please use the GitHub issue tracker.
