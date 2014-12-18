module.exports = function(grunt) {

  var sassOption = 'expanded';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    watch: {
      sass: {
        files: ['scss/*.scss'],
        tasks: ['sass']
      },
      livereload: {
          options: {
              livereload: '<%= connect.options.livereload %>'
          },
          files: [
              'html/*.*',
              'style.css',
              'img/{,*/}*'
          ]
      }
    },
    sass: {
      dist: {                            // Target
        options: {                       // Target options
          style: sassOption
        },
        files: {                         // Dictionary of files
          'style.css': 'style.scss'
        }
      }
    },
    connect: {
        options: {
            port: 9000,
            open: true,
            livereload: 35729,
            // Change this to '0.0.0.0' to access the server from outside
            hostname: 'localhost'
        },
        server: {
          options: {
            port: 9001,
            base: './'
          }
        }
      }

  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['sass', 'connect', 'watch']);

};


