/*
|--------------------------------------------------------------------------
| Requirejs configuration
|--------------------------------------------------------------------------
|
| This file is used by both the browser & command line optomisation 
| tool (see gruntfile.js)
|
| baseUrl
| data-main script (this file) is in the assets directory, while all 
| external library scripts are within js subdirectory
| 
| paths
| set paths for external libraries and main which is not in directory above baseUrl
| 
| shim
| Non AMD jquery plugins need to be explicitly set as a jquery dependency
|
*/
require.config({
    baseUrl: './assets/js',
    paths: {
     'main'                    : '../main'
    ,'jquery'                  : '../vendor/jquery/dist/jquery'
    ,'modernizr'               : '../vendor/modernizr/modernizr'
    ,'jquery.ui.widget'        : '../vendor/blueimp-file-upload/js/vendor/jquery.ui.widget'
    ,'jquery.visible'          : '../vendor/jquery-visible/jquery.visible'
    ,'jquery.knob'             : '../vendor/jquery-knob/js/jquery.knob'
    ,'jquery.fileupload'       : '../vendor/blueimp-file-upload/js/jquery.fileupload'
    ,'jquery.iframe-transport' : '../vendor/blueimp-file-upload/js/jquery.iframe-transport'
    ,'jquery.picker'           : '../vendor/pickadate/lib/picker'
    ,'jquery.picker.date'      : '../vendor/pickadate/lib/picker.date'
    ,'sly'                     : '../vendor/sly/dist/sly'
    ,'easing'                  : '../vendor/jquery-easing/index'
    ,'pie'                     : '../vendor/bower-pie/build/PIE_uncompressed'
  },
  shim: {
     'jquery' : { exports: 'jQuery' }
    ,'sly'    : ['jquery']
    ,'jquery.visible'         : ['jquery']
    ,'jquery.knob'            : ['jquery']
    ,'jquery.picker.date'     : ['jquery', 'jquery.picker']
  }
});

// Global namespace with application prefix
window.bsp = {
  registry  : {},
  callbacks : {}, // actions for hooks
  timer     : null // store timer ids
};

// define(function (require) {

//   var className = document.body.className,
//       page      = className.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }),
//       moduleID  = 'pages/' + page;

//   require('pages/common');
//   require(moduleID); // Error: Module name "pages/home" has not been loaded yet for context: _ http://requirejs.org/docs/errors.html#notloaded
// });

require(['page/common', 'apple-scrollbar']);