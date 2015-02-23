'use strict';

module.exports = function(grunt) {
  var config;

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  config = {
    app: 'app',
    dist: 'build'
  };

  grunt.initConfig({
    config: config,
    watch: {
      sprites: {
        files: [ '<%= config.app %>/images/sprites/*.png', 'app/sass/utils/_sprites.template.mustache' ],
        tasks: [ 'sprite' ],
        options: {
          event: ['deleted', 'added', 'changed']
        }
      },
      svgSprites: {
        files: [ '<%= config.app %>/images/svg/*.svg' ],
        tasks: [ 'svg_sprite' ],
        options: {
          event: ['deleted', 'added', 'changed']
        }
      },
      js: {
        files: [ '<%= config.app %>/js/**/*.js' ],
        tasks: [ 'jshint:app', 'karma:unit' ]
      },
      jsTest: {
        files: [ 'test/spec/**/*.js' ],
        tasks: [ 'jshint:test', 'karma:unit' ]
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= config.app %>/sass/**/*.scss'],
        tasks: ['sass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= config.app %>/css/**/*'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            '<%= config.app %>/*.html',
            '<%= config.app %>/js/**/*.js',
            '.tmp/css/**/*',
            '<%= config.app %>/images/**/*',
            '!<%= config.app %>/images/sprites/**/*'
          ]
        },
        options: {
          watchTask: true,
          logConnections: true,
          minify: false,
          host: 'localhost',
          port: 9000,
          ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
          },
          ui: {
            port: 8080
          },
          server: {
            baseDir: ['app', '.tmp'],
            routes: {
              '/bower_components': 'bower_components'
            }
          }
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    sass: {
      options: {
        sourceMap: true,
        includePaths: [
          'bower_components/bourbon/dist/',
          'bower_components/neat/app/assets/stylesheets/',
          'bower_components/bitters/app/assets/stylesheets/',
          'bower_components/fontawesome/scss/'
        ],
        imagePath: '/images'
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/sass',
          src: [ '*.scss' ],
          dest: '.tmp/css',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/sass',
          src: [ '*.scss' ],
          dest: '.tmp/css',
          ext: '.css'
        }]
      }
    },
    sprite: {
      all: {
        src: 'app/images/sprites/*.png',
        imgPath: 'images/sprites-generated.png',
        dest: 'app/images/sprites-generated.png',
        cssTemplate: 'app/sass/spriting/_png-sprites.scss.mustache',
        cssSpritesheetName: 'sprites',
        destCss: 'app/sass/spriting/_png-sprites.scss'
      }
    },
    'svg_sprite': {
      sprites: {
        expand: true,
        cwd: 'app/images/svg',
        src: [ '**/*.svg' ],
        dest: 'app',

        options: {
          mode: {
            symbol: {
              dest: '.',
              sprite: 'images/sprites-generated.svg',
              prefix: 'svg-%s',
              dimensions: '%s',
              render: {
                scss: {
                  template: 'app/sass/spriting/_svg-sprites.scss.mustache',
                  dest: 'sass/spriting/_svg-sprites.scss'
                }
              }
            }
          }
        }
      }
    },
    kss: {
      options: {
        template: 'styleguide-template'
      },
      app: {
        files: {
          'build/styleguide': [ 'app/sass' ]
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/css/',
          src: '*.css',
          dest: '.tmp/css/'
        }]
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '/js/**/*.js',
            '/css/**/*.css',
            '/images/**/*.*',
            '/*.{ico,png}'
          ].map(prependFilepathWithDist)
        }
      }
    },
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>',
        root: '.'
      },
      html: '<%= config.app %>/index.html'
    },
    usemin: {
      options: {
        assetsDirs: ['/', '/images'].map(prependFilepathWithDist),
        patterns: {
          html: [
            [/(images\/sprites-generated\.svg)/, 'Replacing sprites generated SVG']
          ]
        }
      },
      html: ['/*.html'].map(prependFilepathWithDist),
      css: ['/css/*.css'].map(prependFilepathWithDist)
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: [
            '**/*.{gif,jpeg,jpg,png}',
            '!sprites/**/*'
          ],
          dest: '<%= config.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          minifyJS: true,
          minifyCSS: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= config.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/**/*.webp',
            'js/{,*/}views/**/*.html',
            'images/*.svg',
            '*.html',
            'css/fonts/**/*'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: 'bower_components/fontawesome/fonts',
          src: '**/*',
          dest: '<%= config.dist %>/css/fonts/'
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/css',
        dest: '.tmp/css/',
        src: '*.css'
      },
      styleguide: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.tmp/css',
          dest: '<%= config.dist %>/styleguide/build/css',
          src: '*'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= config.app %>/images',
          dest: '<%= config.dist %>/styleguide/build/images',
          src: '*'
        }]
      },
      fontawesome: {
        expand: true,
        dot: true,
        cwd: 'bower_components/fontawesome/fonts',
        src: '**/*',
        dest: '.tmp/css/fonts/'
      }
    },
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/js',
          src: [ '*.js' ],
          dest: '.tmp/concat/js'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      app: {
        src: [
          'Gruntfile.js',
          '<%= config.app %>/js/**/*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/**/*.js']
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      },
      coverage: {
        configFile: 'test/karma.conf.js',
        reporters: ['spec' , 'coverage'],
        singleRun: true
      }
    },
    concurrent: {
      options: {
        limit: 5
      },
      server: [ 'sass:server', 'copy:styles' ],
      dist: [ 'sass:dist', 'copy:styles', 'imagemin' ]
    }
  });

  grunt.registerTask('serve', [
    'clean:server',
    'sprite',
    'svg_sprite',
    'jshint',
    'concurrent:server',
    'newer:copy:fontawesome',
    'autoprefixer',
    'browserSync:dev',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'sprite',
    'svg_sprite',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'cssmin',
    'uglify',
    'copy:dist',
    'rev',
    'usemin',
    'htmlmin',
    'copy:styleguide',
    'kss'
  ]);

  grunt.registerTask('styleguide', [
    'clean:dist',
    'sprite',
    'svg_sprite',
    'sass:dist',
    'autoprefixer',
    'copy:styles',
    'copy:dist',
    'copy:styleguide',
    'kss'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'karma:coverage',
    'build'
  ]);

  function prependFilepathWithDist(filepath) {
    return '<%= config.dist %>' + filepath;
  }
};
