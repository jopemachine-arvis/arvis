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

  it('Test 2 - scriptFilter basic operation', async function () {
    await app.client.waitUntilWindowLoaded();
    await app.client.switchWindow('searchWindow');

    const { key, modifier } = setting.toggle_search_window_hotkey;
    robot.keyTap(key, modifier);

    await sleep(500);

    robot.keyTap('t');
    robot.keyTap('2');

    await app.client.waitUntilTextExists('#searchResultItemTitle-0', 'scriptfilter item 1');

    const itemTitle = await (await app.client.$('#searchResultItemTitle-0')).getText();
    const itemSubTitle = await (await app.client.$('#searchResultItemSubTitle-0')).getText();

    assert.strictEqual(itemTitle, 'scriptfilter item 1');
    assert.strictEqual(itemSubTitle, 'subtitle 1');

    robot.keyToggle('control', 'down', ['control']);

    await sleep(1000);

    const itemTitle2 = await (await app.client.$('#searchResultItemTitle-0')).getText();
    const itemSubTitle2 = await (await app.client.$('#searchResultItemSubTitle-0')).getText();

    assert.strictEqual(itemTitle2, 'pressed ctrl');
    assert.strictEqual(itemSubTitle2, 'pressed ctrl subtitle');

    await sleep(1000);

    robot.keyToggle('control', 'up', ['control']);

    const itemTitle3 = await (await app.client.$('#searchResultItemTitle-0')).getText();
    const itemSubTitle3 = await (await app.client.$('#searchResultItemSubTitle-0')).getText();

    assert.strictEqual(itemTitle3, 'scriptfilter item 1');
    assert.strictEqual(itemSubTitle3, 'subtitle 1');

    await sleep(200);

    robot.keyTap('enter');

    await sleep(500);

    const copiedText = await app.electron.clipboard.readText();

    assert.strictEqual(copiedText, 'Test 2 - scriptFilter, result');
  });
});
