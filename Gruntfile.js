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
        dest: '../dist/'
      }
    },
    concat: {
    },
    uglify: {
    },
    cssmin: {
    },
    usemin: {
      
    }

  });

  //load Grunt tasks installed by npm
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('test', [
    'jshint', 'karma'
  ]);

  grunt.registerTask('build', [
    'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin'
  ]);
};
