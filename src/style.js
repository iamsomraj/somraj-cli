import { stripVTControlCharacters } from 'node:util';
import pc from 'picocolors';

// The portfolio's one accent colour, #ffaa00, as a 24-bit ANSI colour.
export const brand = (text) =>
  pc.isColorSupported ? `\x1b[38;2;255;170;0m${text}\x1b[39m` : text;

export const muted = pc.dim;
export const strong = pc.bold;

export const visibleLength = (text) => stripVTControlCharacters(text).length;

export const width = () =>
  Math.max(40, Math.min(process.stdout.columns || 80, 80) - 4);

// `§ 02 — EXPERIENCE`, like the section labels on the site.
export const label = (index, title) =>
  `${brand('§')} ${muted(`${String(index).padStart(2, '0')} —`)} ${strong(
    title.toUpperCase(),
  )}`;

// Wrap plain text to `max` columns. Later lines are prefixed with `indent`.
export const wrap = (text, max, indent = '') =>
  wrapWords(text.split(/\s+/), max, indent);

// `React · Vue · Node`, wrapped so each `·` stays at the end of a line and
// multi-word items like `React Query` never split.
export const list = (items, max) =>
  wrapWords(
    items.map((item, i) => (i < items.length - 1 ? `${item} ·` : item)),
    max,
  );

function wrapWords(words, max, indent = '') {
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line && visibleLength(`${line} ${word}`) > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.join(`\n${indent}`);
}

export const bareUrl = (url) =>
  url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
