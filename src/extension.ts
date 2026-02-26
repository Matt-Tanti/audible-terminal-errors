import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  console.log('Audible terminal errors is now active!');

  // Method 1: Terminal commands (shell integration)
  context.subscriptions.push(
    vscode.window.onDidEndTerminalShellExecution((e) => {
      const config = vscode.workspace.getConfiguration('audibleErrors');
      if (!config.get<boolean>('enabled')) {
        return;
      }

      if (e.exitCode === undefined || e.exitCode === 0 || e.exitCode === 130) {
        return;
      }

      const terminalName = e.terminal.name.toLowerCase();
      const ignoredTerminals = config.get<string[]>('ignoredTerminals') || [];

      if (
        ignoredTerminals.some((name) =>
          terminalName.includes(name.toLowerCase()),
        )
      ) {
        return;
      }

      // Skip package installs if they fail (often noisy)
      const cmd = e.execution.commandLine.value.toLowerCase().trim();
      const ignoreCmds = [
        'npm i',
        'npm install',
        'yarn install',
        'pnpm install',
        'pip install',
        'brew',
      ];
      if (ignoreCmds.some((c) => cmd.startsWith(c))) {
        return;
      }

      playSound(context);
    }),
  );

  // Method 2: Task failures
  context.subscriptions.push(
    vscode.tasks.onDidEndTaskProcess((e) => {
      const config = vscode.workspace.getConfiguration('audibleErrors');
      if (!config.get<boolean>('enabled')) {
        return;
      }

      if (e.exitCode === undefined || e.exitCode === 0 || e.exitCode === 130) {
        return;
      }

      playSound(context);
    }),
  );
}

function playSound(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('audibleErrors');
  const customPath = config.get<string>('soundPath');

  let soundPath: string;

  if (customPath && fs.existsSync(customPath)) {
    soundPath = customPath;
  } else {
    soundPath = path.join(context.extensionPath, 'sounds', 'windows-error.mp3');
  }

  const platform = process.platform;
  let cmd: string;

  if (platform === 'darwin') {
    cmd = `afplay "${soundPath}"`;
  } else if (platform === 'linux') {
    // Try multiple common players on linux
    cmd = `mpg123 -q "${soundPath}" 2>/dev/null || aplay "${soundPath}" 2>/dev/null || paplay "${soundPath}" 2>/dev/null`;
  } else if (platform === 'win32') {
    cmd = `powershell -c "$p = New-Object System.Windows.Media.MediaPlayer; $p.Open('${soundPath}'); $p.Play(); Start-Sleep 3"`;
  } else {
    return;
  }

  cp.exec(cmd, (err) => {
    if (err) {
      console.error(
        'Audible terminal errors failed to play sound:',
        err.message,
      );
    }
  });
}

export function deactivate() {}
