const robot = require('robotjs');

const pushInput = async (inputs, before, after) => {
  before && await sleep(before);
  for (const char of inputs) {
    robot.keyTap(char);
  }
  after && await sleep(after);
};

const pushWhitespace = () => {
  robot.keyTap('space');
};

const popInput = async () => {
  robot.keyTap('backspace');
};

const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const reserveKeyPress = async (key, time, after) => {
  await sleep(time ? time : 500);
  robot.keyTap(key);
  after && await sleep(after);
};

const reserveEnter = async (time, after) => {
  await reserveKeyPress('enter', time, after);
};

const getSearchbarText = async (app) => {
  const searchBar = await app.client.$('#searchBar');
  return await searchBar.getValue();
};

const getSearchResultCount = async (app) => {
  return (await app.client.$$('.searchResultItem')).length;
};

module.exports = {
  getSearchbarText,
  getSearchResultCount,
  popInput,
  pushInput,
  pushWhitespace,
  reserveEnter,
  reserveKeyPress,
  sleep,
};
