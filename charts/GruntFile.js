module.exports = function(grunt) {
    grunt.initConfig({
        cssmin: {
            dist: {
                files: {
                    'dist/style.min.css': [
                        'public/style/reset.css',
                        'public/style/blocks/*.css'
                    ]
                }
            }
        },
        requirejs: {
            dist: {
                options: {
                    mainConfigFile: 'config.js',
                    out: 'dist/app.min.js',
                    name: 'app',
                    baseUrl: '.'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('default', ['cssmin', 'requirejs']);
};