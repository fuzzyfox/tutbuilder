module.exports = function( grunt ) {
	'use strict';


  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),

    jshint: {
      // Options set based on http://mozweb.readthedocs.org/en/latest/js-style.html
      options: {
        strict: true,
        curly: true,
        newcap: true,
        quotmark: 'single',
        camelcase: true,
        undef: true,
        eqeqeq: true,
        node: true,
        browser: true
      },
      files: [
        'Gruntfile.js',
        'asset/js/**/*.js'
      ]
    },

    less: {
      development: {
        options: {
          paths: [ 'assets/css' ],
          compress: true,
          sourceMap: true,
          sourceMapBasepath: '/',
          sourceMapRootpath: '/'
        },
        files: {
          'assets/css/style.css': 'assets/less/style.less'
        }
      }
    },

    nunjucks: {
      precompile: {
        baseDir: 'assets/',
        src: 'assets/templates/*.html',
        dest: 'assets/templates/nunjucks-templates.js'
      }
    },

    watch: {
      files: [ 'assets/js/*.js', 'assets/less/*.less', 'assets/templates/*.html' ],
      tasks: [ 'jshint', 'less', 'nunjucks' ]
    },

    connect: {
      server: {
        options: {
          port: 1122,
          useAvailablePort: true,
          base: './'
        }
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-connect' );
  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-nunjucks' );

  grunt.registerTask( 'default', [ 'jshint', 'less', 'nunjucks', 'connect', 'watch' ] );
};
