module.exports = function(grunt){

  //configure Grunt tasks
  grunt.initConfig({
    //grunt packages specified in npm file
    pkg: grunt.file.readJSON('package.json'),

    //test
    jshint: {
      files: [
        'client/**/*.js',
        'server/**/*.js'
      ],
      options: {
        //report errors without stopping task
        force: true,
        ignores: [
          //must use **/*.js to 'recursively' ignore all
          'client/bower_components/**/*.js'
        ]
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    //build
    useminPrepare: {
      html: ['client/**/*.html'],
      options: {
        root: 'client',
        dest: '../dist/client',
      }
    },
    concat: {
      options: {
        separator: '\n'
      },
      dist: {}
    },
    uglify: {
      dist: {}
    },
    cssmin: {
    },
    copy: {
      client: {
        expand: true,
        cwd: 'client/',
        //copying bower components to dist
        src: ['**/*.html', 'bower_components/**/*.*'],
        dest: '../dist/client'
      },
      options: {
        force: true,
        // ignore: 'client/bower_components'
      },
      server: {
        expand: true,
        src: [
          'index.js',
          'package.json',
          'server/**/*.*'
        ],
        dest: '../dist'
      }
    },
    usemin: {
      html: ['../dist/client/**/*.html'],
      options: {
        assetsDirs: [
          '../dist/client/',
        ]
      }
    },

    //clean
    clean: {
      src: ['../dist/**/*', '../dist/**/*.*', '!../dist/.git'],
      options: {
        force: true
      }
    }
  });

  //load Grunt tasks installed by npm
  require('matchdep').filterDev('grunt-*')
    .forEach(grunt.loadNpmTasks);
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-karma');
  // grunt.loadNpmTasks('grunt-usemin');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('test', [
    'jshint', 'karma'
  ]);

  grunt.registerTask('build', [
    'clean',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'copy:client',
    'usemin',
    'copy:server'
  ]);
};
