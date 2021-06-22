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

  // To do:: Need to improve async action chain test
  it('Test u1 - keyword + scriptfilter + keyword', async function () {
    await app.client.waitUntilWindowLoaded();
    await app.client.switchWindow('searchWindow');

    const { key, modifier } = setting.toggle_search_window_hotkey;
    robot.keyTap(key, modifier);

    await sleep(500);
 
    robot.keyTap('u');
    robot.keyTap('1');

    await app.client.waitUntilTextExists('#searchResultItemTitle-0', 'scriptfilter item 1');

    const itemTitle = await (await app.client.$('#searchResultItemTitle-0')).getText();

    assert.strictEqual(itemTitle, 'scriptfilter item 1');

    robot.keyTap('enter');

    const itemTitle2 = await (await app.client.$('#searchResultItemTitle-0')).getText();

    assert.strictEqual(itemTitle2, 'Test u1 - keyword + scriptfilter + keyword, result 1');

    robot.keyTap('enter');

    await sleep(500);

    assert.strictEqual(await app.electron.clipboard.readText(), 'Test u1 - keyword + scriptfilter + keyword, result 2');
  });
});
