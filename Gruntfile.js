'use strict';
/**
 * AssembleSample.
 * install grant and exec `grunt release`
 */
var path = require('path');

module.exports = function(grunt) {
    var taskName;
    var projectPath = 'public_html';
    var releasePath = 'release';
    // assembleパス 変数
    var assembleDATA = 'layouts/config.yml',
        assembleLayout = 'layouts/default.html',
        assemblePartials = 'layouts/**/*.html',
        assembleSrc = '**/*.html';

    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: pkg,
        // ファイルをコピーする
        copy: {
            html: {
                expand: true,
                cwd: projectPath,
                src: ['**/*.html'],
                dest: releasePath
            },
            css: {
                expand: true,
                cwd: projectPath,
                src: ['css/**'],
                dest: releasePath
            },
            images: {
                expand: true,
                cwd: projectPath,
                src: ['images/**'],
                dest: releasePath
            },
            js: {
                expand: true,
                cwd: projectPath,
                src: ['js/**'],
                dest: releasePath
            }
        },
        assemble: {
            build: {
                options: {
                    data: [assembleDATA],
                    layout: assembleLayout,
                    partials: assemblePartials
                },
                files: [{
                        expand: true,
                        cwd: projectPath,
                        src: assembleSrc,
                        dest: releasePath
                }]
            }
        },
        htmlmin: {
            all: {
                options: {
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeCDATASectionsFromCDATA: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    removeOptionalTags: true
                },
                expand: true,
                cwd: releasePath,
                src: ['**/*.html'],
                dest: releasePath+'/'
            }
        },
        // JSを圧縮する
        uglify: {
            min: {
                expand: true,
                cwd: releasePath+'/js',
                src: ['**/*.js'],
                dest: releasePath+'/js/'
            }
        },
        // CSSを圧縮する
        cssmin: {
            min: {
                expand: true,
                cwd: releasePath+'/css',
                src: ['**/*.css'],
                dest: releasePath+'/css/'
            }
        },
        // 画像を圧縮する
        imagemin: {
            files: {
                expand: true,
                cwd: releasePath+'/images',
                src: ['**/*.{png,jpg,gif}'],
                dest: releasePath+'/images/'
            }
        },
        // 不要なファイルを削除する
        clean: {
            // releaseフォルダ内を削除する
            deleteReleaseFolder: {
                src: releasePath+'/'
            }
        }
    });

    // pakage.jsonに記載されているパッケージを自動読み込み
    for(taskName in pkg.devDependencies) {
        if(taskName.substring(0, 6) == 'grunt-') {
            grunt.loadNpmTasks(taskName);
        }
    }
    grunt.task.loadNpmTasks('assemble');

    grunt.registerTask('a', ['clean:deleteReleaseFolder', 'copy', 'assemble', 'htmlmin']);
    grunt.registerTask('release', ['clean:deleteReleaseFolder', 'copy', 'assemble', 'imagemin', 'cssmin', 'uglify', 'htmlmin']);

    grunt.registerTask('eatwarnings', function() {
        grunt.warn = grunt.fail.warn = function(warning) {
            grunt.log.error(warning);
        };
    });

};