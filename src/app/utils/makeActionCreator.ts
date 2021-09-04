/**
 * @param type
 * @param argNames
 */
export function makeActionCreator(type: string, ...argNames: string[]) {
  return function actionCreator(...args: any[]) {
    type ActionObj = {
      [key: string]: any;
    };
    const payload: ActionObj = {};
    argNames.forEach((arg: any, index: number) => {
      payload[arg] = args[index];
    });
    return { type, payload };
  };
}

/**
 * @param type
 */
export function makeDefaultActionCreator(type: string) {
  return makeActionCreator(type, 'arg');
}
