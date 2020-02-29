/* config-overrides.js */
const {
  override,
  fixBabelImports,
} = require('customize-cra');
const reactHotLoader = require('react-app-rewire-hot-loader');

// Override Webpack default config
module.exports = override(
  fixBabelImports('@aurora_app/ui-library', {
    libraryName: 'aurora-ui',
    libraryDirectory: 'lib',
    camel2DashComponentName: false, // default: true
  }),
  fixBabelImports('antd', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: false,
  }),
  fixBabelImports('lodash', {
    libraryName: 'lodash',
    libraryDirectory: '',
    camel2DashComponentName: false, // default: true
  }),
  fixBabelImports('react-use', {
    libraryName: 'react-use',
    libraryDirectory: 'lib',
    camel2DashComponentName: false,
  }),
  fixBabelImports('date-fns', {
    libraryName: 'date-fns',
    libraryDirectory: '',
    camel2DashComponentName: false,
  }),
  fixBabelImports('free-brands', {
    libraryName: '@fortawesome',
    libraryDirectory: 'free-brands-svg-icons',
    camel2DashComponentName: false,
  }),
  fixBabelImports('free-solid', {
    libraryName: '@fortawesome',
    libraryDirectory: 'free-solid-svg-icons',
    camel2DashComponentName: false,
  }),
  fixBabelImports('pro-duotone', {
    libraryName: '@fortawesome',
    libraryDirectory: 'pro-duotone-svg-icons',
    camel2DashComponentName: false,
  }),
  fixBabelImports('pro-light', {
    libraryName: '@fortawesome',
    libraryDirectory: 'pro-light-svg-icons',
    camel2DashComponentName: false,
  }),
  fixBabelImports('pro-regular', {
    libraryName: '@fortawesome',
    libraryDirectory: 'pro-regular-svg-icons',
    camel2DashComponentName: false,
  }),
  fixBabelImports('pro-solid', {
    libraryName: '@fortawesome',
    libraryDirectory: 'pro-solid-svg-icons',
    camel2DashComponentName: false,
  }),
  // React hot loader
  reactHotLoader,
);
