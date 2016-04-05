'use strict';

var Server = require('karma').Server;
var path = require('path');

module.exports = {
  watch: function() {
    // Documentation: https://karma-runner.github.io/0.13/dev/public-api.html
    var karmaConfig = {
      configFile: path.join(__dirname, '../karma.conf.js'),
      singleRun: false,

      // Fancy runner
      plugins: ['karma-webpack', 
      //'karma-jasmine', 
      'karma-mocha-reporter',
            'karma-mocha',
            'karma-sourcemap-loader',
'karma-sinon-chai',
'karma-coverage',
'karma-spec-reporte',
      /*'karma-junit-reporter', 'karma-coverage', */'karma-sourcemap-loader', 'karma-phantomjs-launcher'], 
      reporters: ['mocha']
    };

console.log(karmaConfig.plugins);

    new Server(karmaConfig, karmaCompleted).start();

    function karmaCompleted(exitCode) {
      process.exit(exitCode);
    }
  }
};
