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

describe('Basic test', function () {
  this.timeout(setting.timeout);

  const { key, modifier } = setting.toggle_search_window_hotkey;

  it('Test 1 - show largeTextWindow', async function () {
    await app.client.waitUntilWindowLoaded();
    await app.client.switchWindow('searchWindow');
    robot.keyTap(key, modifier);

    await sleep(500);

    robot.keyTap('t');
    robot.keyTap('1');

    await app.client.waitUntilTextExists('#searchResultItemTitle-0', 'Test 1 - keyword');

    const itemTitle = await (await app.client.$('#searchResultItemTitle-0')).getText();
    const itemSubTitle = await (await app.client.$('#searchResultItemSubTitle-0')).getText();

    assert.strictEqual(itemTitle, 'Test 1 - keyword');
    assert.strictEqual(itemSubTitle, 'mock-subtitle');

    await sleep(200);
    robot.keyToggle('command', 'down', ['command']);
    await sleep(50);
    robot.keyTap('l', 'command');
    await sleep(50);
    robot.keyToggle('command', 'up', ['command']);
    await sleep(200);

    await app.client.switchWindow('largeTextWindow');
    const largeText = await (await app.client.$('#largeText')).getText();
    assert.strictEqual(largeText, 'Test 1 - keyword');

    robot.keyTap('escape');
    await sleep(100);
    robot.keyTap('escape');
  });

  it('Test 2 - show quicklookWindow', async function () {
    await app.client.waitUntilWindowLoaded();
    await app.client.switchWindow('searchWindow');

    robot.keyTap(key, modifier);

    await sleep(500);

    robot.keyTap('t');
    robot.keyTap('2');

    await sleep(1200);
    robot.keyToggle('shift', 'down', ['shift']);
    await sleep(50);
    robot.keyTap('space', 'shift');
    await sleep(50);
    robot.keyToggle('shift', 'up', ['shift']);
    await sleep(200);

    await app.client.switchWindow('quicklookWindow');
    await sleep(1000);
    robot.keyTap('escape');
    robot.keyTap('escape');
  });
});
