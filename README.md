# Audible Terminal Errors

A VS Code extension that plays a sound whenever a terminal command or task fails with a non-zero exit code.

## 🚀 Getting Started

### 1. Prerequisites

- **VS Code 1.93+**
- **Shell Integration** must be enabled (enabled by default in modern VS Code).
- **A Media Player** for your OS:
  - **Linux**: `mpg123`, `aplay`, or `paplay`.
  - **macOS/Windows**: Built-in support.

### 2. Packaging the Extension

To package this into a `.vsix` file that you can install or share:

1. Open a terminal in the project directory.
2. Install the VS Code Extension Manager globally:
   ```bash
   npm install -g @vscode/vsce
   ```
3. Compile the code:
   ```bash
   yarn compile
   ```
4. Package the extension:
   ```bash
   vsce package
   ```
5. A `.vsix` file (e.g., `audible-terminal-errors-1.0.0.vsix`) will be created.

### 3. Installing the Extension

1. In VS Code, go to the **Extensions** view (Ctrl+Shift+X).
2. Click the **...** (Views and More Actions) menu in the top right.
3. Select **Install from VSIX...**.
4. Choose the generated `.vsix` file.

## ⚙️ How to Change Sounds

You can customize the sound in two ways:

### Method A: Use Settings (Easiest)

1. Open VS Code Settings (`Ctrl+,`).
2. Search for `Audible terminal errors`.
3. Find the **Sound Path** setting.
4. Enter the **absolute path** to your custom `.mp3` or `.wav` file (e.g., `/home/user/sounds/custom_sound.mp3`). If empty, the default 'Windows Error' sound will be used.

### Method B: Replace Default Sound

1. Replace the file `sounds/windows-error.mp3` with your own sound file.
2. Ensure it is named exactly `windows-error.mp3`.
3. Re-package or re-compile.

## 🛠️ Additional Settings

- **Enabled**: Toggle the sound on or off.
- **Ignored Terminals**: A list of terminal names that should _not_ trigger a sound (useful for avoiding noise in AI agents or task terminals).

## 🛡️ Antigravity Optimized

This extension is designed to be "agent-aware". It will automatically ignore terminal errors coming from `antigravity`, `copilot`, `claude`, and other AI agents to ensure they don't drive you crazy while performing complex tasks!
