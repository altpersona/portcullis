# Release Notes - v1.0.0-beta.1

## 🎉 First Beta Release

This is the first beta release of the Neverwinter.nim CLI Tool Interface - a modern GUI frontend for all Neverwinter.nim command-line tools.

## ✨ Features

### Core Functionality

- **Complete Tool Coverage**: GUI interface for all 24 Neverwinter.nim CLI tools
- **Dynamic Tool Discovery**: Automatically extracts usage information from tool source files
- **Intelligent Form Generation**: Creates appropriate input forms based on each tool's options

### User Interface

- **Modern Design**: Clean, responsive interface built with Tailwind CSS
- **Customizable Themes**: Grey scale slider (2-5 range) for personalized appearance
- **Coordinated Backgrounds**: Outer and inner elements change together for visual consistency
- **Responsive Layout**: Works well on different screen sizes

### Enhanced User Experience

- **Input Validation**: Checks required fields and file existence before execution
- **Enhanced Output Display**: Formatted command output with separate stdout/stderr sections
- **Error Handling**: Detailed error messages with troubleshooting tips
- **Help Integration**: Quick access to `--help` for any tool
- **Clear Results**: Button to reset output area

### Tool Management

- **Flexible Binary Paths**: Configure location of Neverwinter.nim binaries
- **File Dialogs**: Easy browsing for input/output files
- **Command Echo**: Shows exactly what command was executed
- **Timeout Protection**: 30-second timeout prevents hanging operations

## 🛠️ Supported Tools

The interface provides GUI access to these Neverwinter.nim CLI tools:

**Archive & Resource Management:**

- nwn_erf - ERF archive operations
- nwn_key_pack, nwn_key_unpack - Key file management
- nwn_key_shadows, nwn_key_transparent - Key file utilities
- nwn*resman*\* - Resource manager tools (cat, diff, extract, grep, pkg, stats)

**File Format Tools:**

- nwn_gff - GFF file format operations
- nwn_ssf - Sound Set File tools
- nwn_tlk - Talk table management
- nwn_twoda - 2DA file utilities

**Development Tools:**

- nwn_asm - Assembly language tools
- nwn_script_comp - Script compilation
- nwn_compressedbuf - Buffer compression utilities

**Network & Sync:**

- nwn_net - Network utilities
- nwn*nwsync*\* - NWSync operations (fetch, print, prune, write)

**Specialized Tools:**

- nwn_erf_tlkify - ERF to TLK conversion

## 📦 Download Options

### Windows

- **Installer**: `Neverwinter.nim-CLI-Tool-Interface-Setup-1.0.0-beta.1.exe` - Full installer with Start Menu integration
- **Portable**: `Neverwinter.nim-CLI-Tool-Interface-1.0.0-beta.1.exe` - Portable executable

### Linux

- **AppImage**: `Neverwinter.nim-CLI-Tool-Interface-1.0.0-beta.1.AppImage` - Universal Linux package
- **Debian Package**: `neverwinter-nim-gui_1.0.0-beta.1_amd64.deb` - For Debian/Ubuntu systems
- **Archive**: `neverwinter-nim-gui-1.0.0-beta.1.tar.gz` - Compressed archive

## 🚀 Getting Started

1. Download the appropriate package for your platform
2. Install/extract and run the application
3. Click Settings (⚙️) to configure the path to your Neverwinter.nim binaries
4. Select a tool from the dropdown menu
5. Configure input/output files and options
6. Click "Run [tool]" to execute or "Show Help" for usage information

## ⚠️ Requirements

- Neverwinter.nim CLI tools must be compiled and available on your system
- Compatible input files for the tools you wish to use

## 🐛 Known Issues

- This is a beta release - please report any issues you encounter
- Icons are using default Electron icons (custom icons coming in future release)
- Some tool-specific advanced options may need manual entry in "Additional Arguments"

## 🔮 Coming Soon

- Custom application icons
- Tool-specific input validation
- Command history and favorites
- Batch processing capabilities
- Plugin system for custom tools

## 📝 Feedback

This is a beta release and we'd love your feedback! Please report issues, suggest improvements, or share your experience using the tool.

---

**Built with**: Electron, Node.js, Tailwind CSS  
**Target**: Neverwinter.nim v8.0.22+ CLI tools  
**Platforms**: Windows 10/11, Linux (x64)
