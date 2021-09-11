export const extractModifier = (modifier: string) => {
  switch (modifier) {
    case 'option':
    case 'opt':
    case 'alt':
      return 'alt';

    case 'shift':
      return 'shift';

    case 'windows':
    case 'window':
    case 'win':
    case 'cmd':
    case 'command':
    case 'meta':
      return 'cmd';

    case 'control':
    case 'ctl':
    case 'ctrl':
      return 'ctrl';
    default:
      return '';
  }
};

/**
 * @param shortcut
 */
export const extractShortcutName = (shortcut: string): string | string[] => {
  const target = shortcut.replaceAll('+', ' ').toLowerCase().trim();

  const keys = target.split(' ');

  const shortcutName = [];

  for (const key of keys) {
    if (!key) continue;

    const possibleModifier = extractModifier(key);
    if (possibleModifier) {
      shortcutName.push(possibleModifier);
    } else {
      shortcutName.push(key);
    }
  }

  return shortcutName.length === 1 ? shortcutName[0] : shortcutName;
};
