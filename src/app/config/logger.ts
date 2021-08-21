const actionColors = {
  args: 'blue',
  clipboard: 'green',
  cond: 'magenta',
  open: 'blue',
  resetInput: 'black',
  script: 'red',
  scriptfilter: 'red',
};

const getActionColor = (actionType: keyof typeof actionColors) => {
  return actionColors[actionType] ?? 'black';
};

const appendStyle = (msg: any) => {
  if (typeof msg === 'string') {
    if (msg.includes('[Action:')) {
      const actionType = msg.split('[Action:')[1].trim().slice(0, -1);
      return [
        `%c${msg}%c`,
        `font-weight: bold; color: ${getActionColor(
          actionType as any
        )}; background-color: #ddd;`,
        `color: unset;`,
      ];
    }

    if (msg.includes('[Scriptfilter ') || msg.includes('[Script output]')) {
      return [`%c${msg}`, `font-weight: bold; color: black;`];
    }

    if (msg.includes('[Debug]')) {
      return [`%c${msg}`, `color: #aaa;`];
    }

    if (msg.includes('* ----------')) {
      return [`%c${msg}`, `font-weight: bold;`];
    }

    if (msg.includes('Executed plugins information')) {
      return [`%c${msg}`, `font-weight: bold; color: blue;`];
    }
  }

  return [msg];
};

export const logger: Partial<Console> = {
  log: (message?: any, ...optionalParams: any[]) => {
    console.log(...appendStyle(message), ...optionalParams);
  },

  error: (message?: any, ...optionalParams: any[]) => {
    console.error(...appendStyle(message), ...optionalParams);
  },
};
