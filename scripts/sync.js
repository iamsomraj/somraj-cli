// Refresh the bundled snapshot from the live site. Runs before every publish.
import { writeFile } from 'node:fs/promises';

const url = 'https://portfolio-iamsomraj.vercel.app/profile.json';

const res = await fetch(url);
if (!res.ok) throw new Error(`Could not fetch ${url}: HTTP ${res.status}`);

const profile = await res.json();
if (profile.version !== 1) throw new Error('Unknown profile version');

const file = new URL('../data/profile.json', import.meta.url);
await writeFile(file, `${JSON.stringify(profile, null, 2)}\n`);
console.log(`Saved ${profile.name}'s profile to data/profile.json`);
