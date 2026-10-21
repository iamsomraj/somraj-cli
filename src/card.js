import {
  bareUrl,
  brand,
  label,
  muted,
  strong,
  visibleLength,
} from './style.js';

// A blueprint-style business card: thin rules with orange `+` crosshairs
// at the corners, like the panels on the portfolio site.
export function renderCard(profile) {
  const { links } = profile;
  const rows = [
    ['web', bareUrl(links.website)],
    ['github', bareUrl(links.github)],
    ['linkedin', bareUrl(links.linkedin)],
    ['x', bareUrl(links.twitter)],
    ['email', profile.email],
  ];

  const lines = [
    '',
    label(0, 'hello'),
    '',
    strong(profile.name),
    `${profile.role} ${muted('·')} ${profile.location}`,
    '',
    ...rows.map(([key, value]) => `${muted(key.padEnd(10))}${value}`),
    '',
    muted(`run ${brand('npx somraj')} any time to see this again`),
    '',
  ];

  const inner = Math.max(...lines.map(visibleLength)) + 6;
  const rule = muted('─'.repeat(inner));
  const side = muted('│');
  const pad = (line) => line + ' '.repeat(inner - 3 - visibleLength(line));

  return [
    `${brand('+')}${rule}${brand('+')}`,
    ...lines.map((line) => `${side}   ${pad(line)}${side}`),
    `${brand('+')}${rule}${brand('+')}`,
  ].join('\n');
}
