module.exports = function(grunt) {

    var pkg = require('./package.json'),
        buildTime =  new Date();

    var srcFiles = [
        'polytouch.js',
        'polytouch.math.js',
        'polytouch.pointer.js',
        'polytouch.pointermap.js',
        'polytouch.gesture.js',
        'polytouch.gesture.tap.js',
        'polytouch.gesture.hold.js',
        'polytouch.gesture.pinch.js'
    ];

    grunt.initConfig({
        outputName: 'polytouch',
        replace: {
            build: {
                files: [{
                    cwd: 'src/',
                    src: srcFiles,
                    dest: 'build/',
                    expand: true,
                    flatten: true
                }],
                options: {
                    patterns: [{
                        json: pkg
                    }, {
                        json: {
                            date: buildTime.toISOString(),
                            year: buildTime.getFullYear()
                        }
                    }]
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['<%= outputName %>.js']
        },
        uglify: {
            min: {
                options: {
                    preserveComments: 'some'
                },
                files : {
                    '<%= outputName %>.min.js' : ['<%= outputName %>.js']
                }
            }
        },
        yuidoc : {
            compile: {
                name: pkg.name,
                description: pkg.description,
                version: pkg.version,
                url: pkg.homepage,
                options: {
                    ignorePaths: ['src/', 'example', 'docs', 'node_modules'],
                    paths: '.',
                    outdir: 'docs/'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.registerTask('default', ['replace', 'jshint', 'uglify', 'yuidoc']);
};
