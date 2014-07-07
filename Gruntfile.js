module.exports = function(grunt) {

    var pkg = require('./package.json'),
        buildTime =  new Date();

    var srcFiles = [
        'src/polytouch.js',
        'src/polytouch.math.js',
        'src/polytouch.pointer.js',
        'src/polytouch.pointermap.js',
        'src/polytouch.gesture.js',
        'src/polytouch.gesture.tap.js',
        'src/polytouch.gesture.hold.js',
        'src/polytouch.gesture.pinch.js'
    ];

    grunt.initConfig({
        outputName: 'polytouch',
        concat: {
            dist: {
                files: {
                    'build/<%= outputName %>.concat.js' : srcFiles
                }
            }
        },
        replace: {
            build: {
                files: [{
                    src: srcFiles,
                    dest: 'build/',
                    expand: true,
                    flatten: true
                }, {
                    'build/<%= outputName %>.concat.js': 'build/<%= outputName %>.concat.js'
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
            all: srcFiles
        },
        uglify: {
            build: {
                options: {
                    report: false,
                    mangle: false,
                    compress: false,
                    beautify: true,
                    preserveComments: 'some'
                },
                files : {
                    '<%= outputName %>.js' : 'build/<%= outputName %>.concat.js'
                }
            },
            min: {
                options: {
                    preserveComments: 'some'
                },
                files : {
                    '<%= outputName %>.min.js' : '<%= outputName %>.js'
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
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat', 'replace', 'uglify', 'yuidoc']);
};
