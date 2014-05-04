(function () {
'use strict';

module.exports = function(grunt) {

  // Plugins
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      foo: {
        options: { stdout: true },
        command: 'echo foo' // ['',''].join('&&');
      }
    },

    sass: {
      run: {
        options: { style: 'compressed' }, // style: 'expanded'
        files:   { 'assets/style.css': 'assets/main.scss' }
      }
    },

    clean: {
      run: [ 'assets/script.min.js', 'assets/style.css' ]
    },

    watch: {
      // reload grunt on changes to config files
      configFiles: {
        files: [ 'Gruntfile.js', 'assets/main.js' ],
        options: {
          reload: true
        }
      },
      // live reload css on changes to files within assets/scss
      sass: {
        files: ['assets/**/*.scss'],
        tasks: ['sass:run'],
        options: {
          livereload: true,
          spawn : false
          // nospawn: true
        }
      },
      // live reload js on changes to files within assets/js
      js: {
        files: ['assets/**/*.js'],
        tasks: ['requirejs:run'],
        options: {
          livereload: true,
          spawn : false
          // nospawn: true
        }
      }
    },

    connect: {
      run: {
        options: {
          hostname: null,
          port: 8081,
          base: './'
        }
      }
    },

    requirejs: {
      run: {
        options: {
          baseUrl: "assets/js",
          name: "main",
          out: "assets/script.min.js",
          mainConfigFile: "assets/main.js"
        }
      }
    },

    jshint: {
      options: {
        'laxcomma': true,
        '-W057': false,
        '-W058': false,
        '-W004': false // allow optional parameters with defining variables
      },
      run: ['Gruntfile.js', 'assets/main.js', 'assets/js/*.js']
    }

  });

  // run
  // clean compiled css or js, echo foo on command line, sass, require, 
  grunt.registerTask('run', 
    ['clean:run', 'shell:foo', 'sass:run', 'jshint:run', 'requirejs:run', 'connect:run', 'watch']);

};
}());