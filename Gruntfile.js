module.exports = function(grunt) {

    var _ = require('lodash');

    grunt.initConfig({
        target_dir: grunt.option('target_dir') || 'target',
        extension_dir: '<%= target_dir %>/extension/',
        temp_dir: '<%= target_dir %>/temp/',
        pkg: grunt.file.readJSON('package.json'),
        version: grunt.option('projectVersion') || '<%= pkg.version %>',

        clean: ['<%= target_dir %>'],

        mkdir: {
            all: {
                options: {
                    create: ['<%= extension_dir %>']
                }
            }
        },

        copy: {
            extensionFiles: {
                expand: true,
                cwd: 'extension_src/',
                src: ['**'],
                dest: '<%= extension_dir %>'
            },
            appFiles: {
                src: ['public/**'],
                dest: '<%= extension_dir %>'
            }
        },

        html2js: {
            options: {
                base: 'public/apps/giphy/templates/'
            },
            main: {
                src: ['public/apps/giphy/templates/*.tpl.html'],
                dest: '<%= extension_dir %>public/apps/giphy/templates/combined.js'
            }
        },

        zip: {
            extension: {
                cwd: '<%= extension_dir %>',
                src: ['<%= extension_dir %>/**'],
                dest: '<%= target_dir %>/<%= pkg.name %>-<%= version %>-extension.zip'
            }
        },

        mavenDeploy: {
            options: {
                groupId: grunt.option('groupId'),
                url: grunt.option('repositoryUrl'),
                version: grunt.option('projectVersion'),
                repositoryId: grunt.option('repositoryId'),
                artifactId: '<%= pkg.name %>'
            },
            extension: {
                file: '<%= target_dir %>/<%= pkg.name %>-<%= version %>-extension.zip',
                classifier: 'extension'
            }
        },

        writeArtifactList: {
            options: {
                groupId: grunt.option('groupId'),
                repositoryUrl: grunt.option('repositoryUrl'),
                artifactId: '<%= pkg.name %>',
                version: grunt.option('projectVersion'),
                files: ['<%= pkg.name %>-<%= version %>-extension.zip'],
                filename: '<%= target_dir %>/artifact-list.properties'
            }
        },

        jshint: {
            js: {
                options: {
                    predef: ['angular', 'Shared'],
                    undef: true,
                    node: true,
                    devel: true,
                    browser: true,
                    globals: {
                        gadgets: false,
                        osapi: false,
                        Handlebars: false,
                        $: false,
                        describe: false,
                        beforeEach: false,
                        it: false,
                        Backbone: false,
                        _: true,
                        assert: false,
                        moment: false,
                        opensocial: false
                    }
                },
                src: ['Gruntfile.js', 'public/**/*.js', '!public/**/thirdparty/**']
            },

            html: {
                options: {
                    extract: 'always',
                    undef: true,
                    browser: true,
                    devel: true,
                    globals: {
                        gadgets: false,
                        osapi: false,
                        Shared: false,
                        Handlebars: false,
                        $: false,
                        Backbone: false,
                        _: true,
                        Q: false,
                        opensocial: false
                    }
                },
                src: ['public/apps/**/*.html']
            }

        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jive-ps');
    grunt.loadNpmTasks('grunt-soy-compile');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-html2js');

    // TODO undo this
    //grunt.registerTask('build', ['prep', 'jshint', 'buildExtension']);
    grunt.registerTask('build', ['prep', 'buildExtension']);

    grunt.registerTask('prep', ['clean', 'mkdir']);
    grunt.registerTask('buildExtension', ['copy:extensionFiles', 'copy:appFiles', 'html2js', 'zip:extension']);

    grunt.registerTask('release', ['build', 'writeArtifactList', 'mavenDeploy:extension']);
    grunt.registerTask('default', ['build']);
};
