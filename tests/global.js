// globals
global.assert = require('assert');
const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const loudRejection = require('loud-rejection');
const robot = require('robotjs');
const path = require('path');
const fse = require('fs-extra');
const pathExists = require('path-exists');
const chalk = require('chalk');
const setting = require('./setting.json');
const { sleep } = require('./utils');

loudRejection();

const app = new Application({
  path: electronPath,
  args: ['src'],
  chromeDriverArgs: setting.chrome_driver_args,
});

before(async () => {
  console.log(chalk.magentaBright('Initializing app for test..'));
  const appStartPromise = app.start();
  await sleep(setting.initialization_time);
  return appStartPromise;
});

beforeEach(async () => {
  console.log(chalk.bgGreenBright('Waiting for next test..'));
  await sleep(2000);
  console.log(chalk.cyan('Starting next test..'));
});

after(function () {
  if (app && app.isRunning()) {
    return app.stop();
  }
});

module.exports = {
  app,
};
