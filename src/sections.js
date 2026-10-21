import { brand, label, list, muted, strong, width, wrap } from './style.js';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });

const bullet = (text) => `  ${brand('•')} ${wrap(text, width() - 4, '    ')}`;

export function about(profile) {
  return [
    label(1, 'about'),
    ...profile.about.map((line) => wrap(line, width())),
  ].join('\n\n');
}

export function experience(profile) {
  const jobs = profile.experience.map((job) => {
    const end = job.end ? formatDate(job.end) : 'present';
    return [
      `${strong(job.company)} ${muted('—')} ${job.title}`,
      muted(`${formatDate(job.start)} – ${end}`),
      ...job.points.map(bullet),
      muted(list(job.tech, width())),
    ].join('\n');
  });
  return [label(2, 'experience'), ...jobs].join('\n\n');
}

export function skills(profile) {
  const groups = profile.skills.map(
    (group) => `${strong(group.group)}\n${list(group.items, width())}`,
  );
  return [label(3, 'skills'), ...groups].join('\n\n');
}

export function projects(profile) {
  const items = profile.projects.map((project) =>
    [
      strong(project.title),
      wrap(project.summary, width()),
      muted(list(project.tech, width())),
      brand(project.url),
    ].join('\n'),
  );
  return [label(4, 'projects'), ...items].join('\n\n');
}

export function posts(profile) {
  const items = profile.posts.map((post) =>
    [
      `${strong(post.title)} ${muted(`· ${formatDate(post.date)}`)}`,
      wrap(post.excerpt, width()),
      brand(post.url),
    ].join('\n'),
  );
  return [label(5, 'latest posts'), ...items].join('\n\n');
}

export const sections = { about, experience, skills, projects, posts };
