#!/usr/bin/env node
import { renderCard } from '../src/card.js';
import { loadProfile } from '../src/data.js';
import { runMenu } from '../src/menu.js';
import { sections } from '../src/sections.js';

const profile = await loadProfile();

console.log(`\n${renderCard(profile)}\n`);

// Piped output or CI: no menu, just print everything and exit.
if (process.stdin.isTTY && process.stdout.isTTY) {
  await runMenu(profile);
} else {
  for (const render of Object.values(sections)) {
    console.log(`${render(profile)}\n`);
  }
}

// A timed-out fetch can leave a socket open that keeps Node alive, so exit
// once everything written so far has been flushed.
process.stdout.write('', () => process.exit(0));
