import { isCancel, log, outro, select } from '@clack/prompts';
import { open } from './open.js';
import { sections } from './sections.js';
import { brand, bareUrl } from './style.js';

export async function runMenu(profile) {
  const { links } = profile;
  const targets = {
    email: `mailto:${profile.email}`,
    github: links.github,
    linkedin: links.linkedin,
    website: links.website,
  };

  while (true) {
    const choice = await select({
      message: 'What would you like to see?',
      options: [
        { value: 'about', label: 'About' },
        { value: 'experience', label: 'Experience' },
        { value: 'skills', label: 'Skills' },
        { value: 'projects', label: 'Projects' },
        { value: 'posts', label: 'Latest posts' },
        { value: 'email', label: 'Send an email', hint: profile.email },
        { value: 'github', label: 'Open GitHub', hint: bareUrl(links.github) },
        {
          value: 'linkedin',
          label: 'Open LinkedIn',
          hint: bareUrl(links.linkedin),
        },
        {
          value: 'website',
          label: 'Open website',
          hint: bareUrl(links.website),
        },
        { value: 'quit', label: 'Quit' },
      ],
    });

    if (isCancel(choice) || choice === 'quit') break;

    if (choice in sections) {
      console.log(`\n${sections[choice](profile)}\n`);
    } else {
      const url = targets[choice];
      const opened = await open(url);
      log.info(opened ? `Opened ${brand(url)}` : `Visit ${brand(url)}`);
    }
  }

  outro(`Thanks for stopping by! ${brand('—')} Somraj`);
}
