const path = require('path');
const { version } = require('./package.json');
const webpackConfig = require('./config/webpack.styleguide.config');

module.exports = {
  require: [
    // link styles for docker
    path.join(__dirname, './src/lib/style/main.scss'),
  ],
  version,
  components: 'src/lib/components/**/index.{j,t}s*',
  template: {
    favicon: 'public/favicon.ico',
  },
  title: 'common-lib-test-microfrontends',
  // use alternative config with minification off
  webpackConfig,
  skipComponentsWithoutExample: true,
};
