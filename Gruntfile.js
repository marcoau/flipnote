module.exports = function(grunt){

  //configure Grunt tasks
  grunt.initConfig({
    //grunt packages specified in npm file
    pkg: grunt.file.readJSON('package.json'),
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
    }
  });

  //load Grunt tasks installed by npm
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', [
    'jshint'
  ]);
};
