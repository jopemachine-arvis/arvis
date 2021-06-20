const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const loudRejection = require('loud-rejection');
const robot = require('robotjs');
const path = require('path');
const fse = require('fs-extra');
const pathExists = require('path-exists');
const setting = require('../setting.json');
const { sleep } = require('../utils');
const { app } = require('../global');

describe('Integration test', function () {
  this.timeout(setting.timeout);

  // To do:: Need to improve async action chain test
  it('Test 4 - muitiple, async action chain', async function () {
    await app.client.waitUntilWindowLoaded();
    await app.client.switchWindow('searchWindow');

    const { key, modifier } = setting.toggle_search_window_hotkey;
    robot.keyTap(key, modifier);

    await sleep(500);

    robot.keyTap('t');
    robot.keyTap('4');

    await app.client.waitUntilTextExists('#searchResultItemTitle-0', 'Test 4 - muitiple, async action chain');

    const itemTitle = await (await app.client.$('#searchResultItemTitle-0')).getText();

    assert.strictEqual(itemTitle, 'Test 4 - muitiple, async action chain');

    robot.keyTap('enter');

    await sleep(100);

    assert.strictEqual(await app.electron.clipboard.readText(), 'Test 4 - muitiple, async action chain, result 1');
  });
});
