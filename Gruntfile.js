"use strict";

module.exports = function(grunt) {
  var config;

  require("load-grunt-tasks")(grunt);
  require("time-grunt")(grunt);

  config = {
    app: "app",
    dist: "build"
  };

  grunt.initConfig({
    config: config,
    watch: {
      sprites: {
        files: [ "<%= config.app %>/images/sprites/*.png", 'app/sass/utils/_sprites.template.mustache' ],
        tasks: [ "sprite" ],
        options: {
          event: ['deleted', 'added', 'changed']
        }
      },
      gruntfile: {
        files: ["Gruntfile.js"]
      },
      sass: {
        files: ["<%= config.app %>/sass/**/*.scss"],
        tasks: ["sass:server", "autoprefixer"]
      },
      styles: {
        files: ["<%= config.app %>/css/**/*"],
        tasks: ["newer:copy:styles", "autoprefixer"]
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            "<%= config.app %>/*.html",
            ".tmp/css/**/*",
            "<%= config.app %>/images/**/*",
            "!<%= config.app %>/images/sprites/**/*"
          ]
        },
        options: {
          watchTask: true,
          logConnections: true,
          minify: false,
          host: "localhost",
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
            baseDir: ["app", ".tmp"],
            routes: {
              "/bower_components": "bower_components"
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
            ".tmp",
            "<%= config.dist %>/*",
            "!<%= config.dist %>/.git*"
          ]
        }]
      },
      server: ".tmp"
    },
    sass: {
      options: {
        sourceMap: true,
        includePaths: [
          "bower_components/bourbon/dist/",
          "bower_components/neat/app/assets/stylesheets/"
        ],
        imagePath: '/images'
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: "<%= config.app %>/sass",
          src: [ "*.scss" ],
          dest: ".tmp/css",
          ext: ".css"
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: "<%= config.app %>/sass",
          src: [ "*.scss" ],
          dest: ".tmp/css",
          ext: ".css"
        }]
      }
    },
    sprite: {
      all: {
        src: 'app/images/sprites/*.png',
        imgPath: 'images/sprites-generated.png',
        dest: 'app/images/sprites-generated.png',
        cssTemplate: 'app/sass/utils/_sprites.template.mustache',
        cssSpritesheetName: 'sprites',
        destCss: 'app/sass/utils/_sprites.scss'
      }
    },
    autoprefixer: {
      options: {
        browsers: ["last 1 version"]
      },
      dist: {
        files: [{
          expand: true,
          cwd: ".tmp/css/",
          src: "*.css",
          dest: ".tmp/css/"
        }]
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            "/js/**/*.js",
            "/css/**/*",
            "/images/**/*.*",
            "/*.{ico,png}"
          ].map(prependFilepathWithDist)
        }
      }
    },
    useminPrepare: {
      options: {
        dest: "<%= config.dist %>",
        root: "."
      },
      html: "<%= config.app %>/index.html"
    },
    usemin: {
      options: {
        assetsDirs: ['/', "/images"].map(prependFilepathWithDist)
      },
      html: ["/*.html"].map(prependFilepathWithDist),
      css: ["/css/*.css"].map(prependFilepathWithDist)
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: "<%= config.app %>/images",
          src: "{,*/}*.{gif,jpeg,jpg,png}",
          dest: "<%= config.dist %>/images"
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: "<%= config.app %>/images",
          src: "{,*/}*.svg",
          dest: "<%= config.dist %>/images"
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
          cwd: "<%= config.dist %>",
          src: "*.html",
          dest: "<%= config.dist %>"
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: "<%= config.app %>",
          dest: "<%= config.dist %>",
          src: [
            "*.{ico,png,txt}",
            ".htaccess",
            "images/**/*.webp",
            "*.html",
            "css/fonts/**/*"
          ]
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: "<%= config.app %>/css",
        dest: ".tmp/css/",
        src: "*.css"
      }
    },
    concurrent: {
      options: {
        limit: 5
      },
      server: [ "sass:server", "copy:styles" ],
      dist: [ "sass:dist", "copy:styles", "imagemin", "svgmin" ]
    }
  });

  grunt.registerTask("serve", [
    "clean:server",
    "sprite",
    "concurrent:server",
    "autoprefixer",
    "browserSync:dev",
    "watch"
  ]);

  grunt.registerTask("build", [
    "clean:dist",
    "useminPrepare",
    "sprite",
    "concurrent:dist",
    "autoprefixer",
    "concat",
    "cssmin",
    "uglify",
    "copy:dist",
    "rev",
    "usemin",
    "htmlmin"
  ]);

  grunt.registerTask("default", [
    "build"
  ]);

  function prependFilepathWithDist(filepath) {
    return '<%= config.dist %>' + filepath;
  }
};
