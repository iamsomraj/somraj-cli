import { spawn } from 'node:child_process';

// Open a URL (or mailto: link) with the system's default app.
export function open(url) {
  const [command, args] =
    process.platform === 'darwin'
      ? ['open', [url]]
      : process.platform === 'win32'
        ? ['cmd', ['/c', 'start', '', url]]
        : ['xdg-open', [url]];

  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: 'ignore', detached: true });
    child.on('error', () => resolve(false));
    child.on('spawn', () => {
      child.unref();
      resolve(true);
    });
  });
}
