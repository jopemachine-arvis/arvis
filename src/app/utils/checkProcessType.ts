export const checkIsRendererProc = () => {
  return process && process.type === 'renderer';
};
