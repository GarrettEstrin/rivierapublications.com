module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            tinypng: {
                files: ['images-src/*.jpg'],
                tasks: ['tinypng']
            },
            uglify: {
                files: ['js-src/*.js'],
                tasks: ['uglify']
            }
        },
        tinypng: {
            options: {
                apiKey: 'xTu7SaKDKg4kvslEkohp8GKQFrWUzKlQ',
                checkSigs: true,
                sigFile: 'images-src/tiny_sigs.json',
                summarize: true,
                showProgress: true,
                stopOnImageError: true
           },
            compress: {
                expand: true,
                cwd: 'images-src/',
                src: '*.jpg',
                dest: 'images/',
                ext: '.jpg'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: 'js/built.min.js.map'
              },
            my_target: {
              files: {
                'js/built.min.js': ['js-src/*.js']
              }
            }
          }
    });
    grunt.registerTask('default', ['watch']);
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-tinypng');
};