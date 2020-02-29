// promisified fs module
const fs = require('fs-extra');
const path = require('path');
const webpack = require('@cypress/webpack-preprocessor');

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress/config', `${file}.json`);

  return fs.readJson(pathToConfigFile);
}

// plugins file
module.exports = (on, config) => {
  on(
    'file:preprocessor',
    webpack({
      webpackOptions: require('../webpack.config'),
      watchOptions: {},
    }),
  );

  // accept a configFile value or use development by default
  const file = config.env.configFile || 'dev';

  return getConfigurationByFile(file);
};
