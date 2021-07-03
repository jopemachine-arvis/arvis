const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const loudRejection = require('loud-rejection');
const robot = require('robotjs');
const path = require('path');
const fse = require('fs-extra');
const pathExists = require('path-exists');
const setting = require('../../setting.json');
const { app } = require('../../global');
const {
  pushInput,
  popInput,
  pushWhitespace,
  sleep,
  reserveEnter,
  reserveKeyPress,
  getSearchbarText,
  getSearchResultCount
} = require('../../utils');

describe('Integration test', function () {
  this.timeout(setting.timeout);

  it('a2', async function () {
    await app.client.waitUntilWindowLoaded();
    await app.client.switchWindow('searchWindow');

    const { key, modifier } = setting.toggle_search_window_hotkey;
    robot.keyTap(key, modifier);

    await sleep(500);

    // action 1
    await pushInput('a2');

    await reserveEnter(500, 500);

    await pushInput('t', 0, 1000);

    assert.strictEqual(await getSearchResultCount(app), 3);

    // action 2
    await reserveEnter(500, 500);

    assert.strictEqual(await getSearchbarText(app), 't');

    await pushInput('1', 0, 1000);

    assert.strictEqual(await getSearchResultCount(app), 1);

    // action 3
    await reserveEnter(500, 500);

    assert.strictEqual(await getSearchbarText(app), 't1');

    // To do :: insert here space logic

    // last action
    await reserveEnter(500, 500);

    assert.strictEqual(await app.electron.clipboard.readText(), 'a2');
  });
});
