import { readFile } from 'node:fs/promises';

const PROFILE_URL =
  process.env.SOMRAJ_PROFILE_URL ??
  'https://portfolio-iamsomraj.vercel.app/profile.json';

// Live data from the portfolio site, so the CLI stays up to date without a
// new release. Falls back to the snapshot bundled with the package.
export async function loadProfile() {
  try {
    const res = await fetch(PROFILE_URL, {
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const profile = await res.json();
    if (profile.version !== 1) throw new Error('Unknown profile version');
    return profile;
  } catch {
    return loadSnapshot();
  }
}

export async function loadSnapshot() {
  const file = new URL('../data/profile.json', import.meta.url);
  return JSON.parse(await readFile(file, 'utf8'));
}
