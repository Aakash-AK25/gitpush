module.exports = function(grunt) {
  'use strict';
    // Project configuration.
    grunt.initConfig({
      jshint: {
        all: [
          'bin/*',
          'lib/**/*.js',
          'Gruntfile.js',
          '.unibeautifyrc.json'
        ],
        options: {
          
        }
      },
      flake8: {
        src: [
            'uploads/python.py'
        ],
        options: {
          // Task-specific options go here.
          force: true,
          // errorsOnly: true,
          maxComplexity: 10,
          maxLineLength: 120,
          format: 'pylint',
        },
      }
    });
  
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    grunt.loadNpmTasks('grunt-run-java');

    grunt.loadNpmTasks('grunt-flake8');

    grunt.loadNpmTasks('grunt-eslint');

    // "npm test" runs these tasks
    grunt.registerTask('test', ['jshint']);
    
    grunt.registerTask('test', ['eslint']);

    grunt.registerTask('test', ['run_java']);

    grunt.registerTask('test', ['flake8']);
    // Default task.
    grunt.registerTask('default', ['flake8']);
  
  };