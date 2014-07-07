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
        'public/asset/js/**/*.js'
      ]
    },

    less: {
      development: {
        options: {
          paths: [ 'public/assets/css' ],
          compress: true,
          sourceMap: true,
          sourceMapBasepath: '/',
          sourceMapRootpath: '/'
        },
        files: {
          'public/assets/css/style.css': 'public/assets/less/style.less'
        }
      }
    },

    nunjucks: {
      precompile: {
        baseDir: 'public',
        src: 'public/assets/templates/*.html',
        dest: 'public/assets/templates/nunjucks-templates.js'
      }
    },

    watch: {
      files: [ 'public/assets/js/*.js', 'public/assets/less/*.less', 'public/assets/templates/*.html' ],
      tasks: [ 'jshint', 'less', 'nunjucks' ]
    },

    connect: {
      server: {
        options: {
          port: 1122,
          useAvailablePort: true,
          base: './public'
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'public'
      },
      src: [ '**' ]
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-connect' );
  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-nunjucks' );
  grunt.loadNpmTasks( 'grunt-gh-pages' );

  grunt.registerTask( 'default', [ 'jshint', 'less', 'nunjucks', 'connect', 'watch' ] );
};
