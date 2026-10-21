// Render the real card into docs/preview.svg for the README.
import { mkdir, writeFile } from 'node:fs/promises';

process.env.FORCE_COLOR = '1';
const { default: pc } = await import('picocolors');
const { renderCard } = await import('../src/card.js');
const { loadSnapshot } = await import('../src/data.js');

const profile = await loadSnapshot();

// The menu as clack draws it, frozen on the first option.
const options = ['About', 'Experience', 'Skills', 'Projects', 'Latest posts'];
const menu = [
  `${pc.cyan('◆')}  What would you like to see?`,
  ...options.map((option, i) =>
    i === 0
      ? `${pc.cyan('│')}  ${pc.green('●')} ${option}`
      : `${pc.cyan('│')}  ${pc.dim(`○ ${option}`)}`,
  ),
  `${pc.cyan('│')}  ${pc.dim('○ …')}`,
  pc.cyan('└'),
];

const lines = [
  `${pc.green('$')} npx somraj`,
  '',
  ...renderCard(profile).split('\n'),
  '',
  ...menu,
];

const COLORS = {
  text: '#e4e4e7',
  dim: '#71717a',
  brand: '#ffaa00',
  cyan: '#22d3ee',
  green: '#4ade80',
};
const FG = { 32: 'green', 36: 'cyan', '38;2;255;170;0': 'brand' };
const CHAR = 8.4;
const LINE = 20;
const PAD = 24;
const TOP = 52;

const escape = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Turn one line of ANSI text into SVG. Every word sits on the character
// grid, and box rules become real lines so the frame has no gaps.
function renderLine(line, row) {
  const out = [];
  const style = { fg: 'text', dim: false, bold: false };
  const baseline = TOP + row * LINE;
  const middle = baseline - 5;
  let col = 0;
  for (const part of line.split(/(\x1b\[[0-9;]*m)/)) {
    const code = part.match(/^\x1b\[([0-9;]*)m$/)?.[1];
    if (code !== undefined) {
      if (FG[code]) style.fg = FG[code];
      else if (code === '39') style.fg = 'text';
      else if (code === '2') style.dim = true;
      else if (code === '1') style.bold = true;
      else if (code === '22') style.dim = style.bold = false;
      continue;
    }
    const fill = COLORS[style.dim ? 'dim' : style.fg];
    for (const token of part.split(/(\s+|─+|│)/)) {
      const length = [...token].length;
      const x = PAD + col * CHAR;
      if (token.startsWith('─')) {
        out.push(
          `<line x1="${x}" y1="${middle}" x2="${x + length * CHAR}"` +
            ` y2="${middle}" stroke="${fill}"/>`,
        );
      } else if (token === '│') {
        const cx = x + CHAR / 2;
        out.push(
          `<line x1="${cx}" y1="${middle - LINE / 2}" x2="${cx}"` +
            ` y2="${middle + LINE / 2}" stroke="${fill}"/>`,
        );
      } else if (token.trim()) {
        const weight = style.bold ? ' font-weight="700"' : '';
        out.push(
          `<text x="${x}" y="${baseline}" fill="${fill}"${weight}` +
            ` textLength="${length * CHAR}"` +
            ` lengthAdjust="spacingAndGlyphs">${escape(token)}</text>`,
        );
      }
      col += length;
    }
  }
  return out.map((element) => `    ${element}`).join('\n');
}

const columns = Math.max(
  ...lines.map((line) => [...line.replace(/\x1b\[[0-9;]*m/g, '')].length),
);
const width = Math.ceil(PAD * 2 + columns * CHAR);
const height = TOP + lines.length * LINE + PAD;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="npx somraj output: a business card and a menu">
  <rect width="${width}" height="${height}" rx="10" fill="#09090b"/>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="10" fill="none" stroke="#27272a"/>
  <circle cx="22" cy="20" r="6" fill="#3f3f46"/>
  <circle cx="42" cy="20" r="6" fill="#3f3f46"/>
  <circle cx="62" cy="20" r="6" fill="#3f3f46"/>
  <text x="${width / 2}" y="24" fill="#71717a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">npx somraj</text>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="14">
${lines.map(renderLine).filter(Boolean).join('\n')}
  </g>
</svg>
`;

await mkdir(new URL('../docs/', import.meta.url), { recursive: true });
await writeFile(new URL('../docs/preview.svg', import.meta.url), svg);
console.log(`Saved docs/preview.svg (${width}×${height})`);
