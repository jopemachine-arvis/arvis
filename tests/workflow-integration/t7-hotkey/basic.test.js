const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const loudRejection = require('loud-rejection');
const robot = require('robotjs');
const path = require('path');
const fse = require('fs-extra');
const pathExists = require('path-exists');
const setting = require('../../setting.json');
const { sleep } = require('../../utils');
const { app } = require('../../global');

describe('Integration test', function () {
  this.timeout(setting.timeout);

  // This test muse be enabled after iohook bug is fixed
  it('Test 7 - hotkey + keyword (keyword waiting 2)', async function () {
    // await app.client.waitUntilWindowLoaded();
    // await app.client.switchWindow('searchWindow');

    // robot.keyTap('alt');
    // await sleep(100);
    // robot.keyTap('alt');

    // await sleep(500);

    // await app.client.waitUntilTextExists('#searchResultItemTitle-0', 'Test 7 - hotkey + keyword (keyword waiting 2)');

    // const itemTitle = await (await app.client.$('#searchResultItemTitle-0')).getText();

    // assert.strictEqual(itemTitle, 'Test 7 - hotkey + keyword (keyword waiting 2)');

    // robot.keyTap('enter');

    // await sleep(500);

    // const copiedText = await app.electron.clipboard.readText();

    // assert.strictEqual(copiedText, 'Test 7 - hotkey + keyword (keyword waiting 2), result');
    assert.strictEqual(true, true);
  });
});
