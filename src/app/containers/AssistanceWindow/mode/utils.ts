const lineLimit = 50;
const charLimit = 6000;
const end = ' ...';

export const trimDisplayText = (txt: string) => {
  const lines = txt.split('\n');
  const lineCnt = lines.length;
  const charCnt = txt.length;

  if (lineCnt >= lineLimit) {
    return lines.slice(0, lineLimit).join('\n') + end;
  }
  if (charCnt >= charLimit) {
    return txt.slice(0, charLimit) + end;
  }
  return txt;
};
