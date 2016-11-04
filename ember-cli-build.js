/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    storeConfigInMeta: false,
    babel: {
      includePolyfill: true
    },
  });


  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('vendor/js/jquery/jquery-1.11.3.min.js');
  app.import('vendor/js/jquery/jquery-migrate-1.2.1.min.js');
  app.import('vendor/js/jquery/jquery-ui.min.js');
  app.import('vendor/js/jquery/jquery.imgpreloader.js');
  app.import('vendor/js/jquery/jquery.SPServices-2014.01.min.js');
  app.import('vendor/js/jquery/jquery.ui.touch-punch.min.js');
  app.import('vendor/js/bw/database_connection.js');
  app.import('vendor/js/bw/document.js');
  app.import('vendor/js/bw/game.js');
  app.import('vendor/js/bw/list_connection.js');
  return app.toTree();
};
