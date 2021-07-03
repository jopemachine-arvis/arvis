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
  getSearchbarText
} = require('../../utils');

describe('Integration test', function () {
  this.timeout(setting.timeout);

  it('a1', async function () {
    await app.client.waitUntilWindowLoaded();
    await app.client.switchWindow('searchWindow');

    const { key, modifier } = setting.toggle_search_window_hotkey;
    robot.keyTap(key, modifier);

    await sleep(500);

    // action 1
    pushInput('a1');

    await reserveEnter(500, 500);

    pushInput('abc');

    // action 2
    await reserveEnter(500, 500);

    assert.strictEqual(await app.electron.clipboard.readText(), 'abc');

    assert.strictEqual(await getSearchbarText(app), 'abc');

    pushWhitespace();

    pushInput('def');

    // action 3
    await reserveEnter(500, 500);

    assert.strictEqual(await getSearchbarText(app), 'abc def');

    // To do :: insert here space logic

    // last action
    await reserveEnter(500, 500);

    assert.strictEqual(await app.electron.clipboard.readText(), 'a1');
  });
});
