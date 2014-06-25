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
        dest: '../dist/',
        // ignore: 'client/bower_components'
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {}
    },
    uglify: {
      dist: {}
    },
    cssmin: {
    },
    copy: {
      main: {
        expand: true,
        cwd: 'client/',
        src: '**/*.html',
        dest: '../dist/public'
      },
      options: {
        force: true,
        // ignore: 'client/bower_components'
      }
    },
    usemin: {
      html: ['../dist/public/**/*.html'],
      options: {
        assetsDirs: [
          '../dist/public/css',
          '../dist/public/js'
        ]
      }
    },

    //clean
    clean: ['../dist']
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
    'useminPrepare', 'concat', 'uglify', 'cssmin', 'copy:main', 'usemin'
  ]);
};
