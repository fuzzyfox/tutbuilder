/* globals $, Prism, Make, Promise, Error, nunjucks, marked */

/*
  Data store
 */
(function( window, document, undefined ) {
  'use strict';

  function Tutorial() {
    this.order = [];
    this.sections = {};
  }

  Tutorial.prototype = {
    getOrder: function() {
      return JSON.parse( JSON.stringify( this.order ) );
    },
    getSections: function() {
      return JSON.parse( JSON.stringify( this.sections ) );
    },
    reorder: function( order ) {
      this.order = order;
      return this.getOrder();
    },
    push: function( obj ) {
      var id = ( new Date() ).valueOf();

      this.sections[ id ] = obj;
      this.order.push( id );
    },
    remove: function( id ) {
      var idx = this.order.indexOf( id );

      if( idx > -1 ) {
        this.order.splice( idx, 1 );
      }

      if( id in this.sections ) {
        delete this.sections[ id ];
      }
    }
  };

  window.Tutorial = Tutorial;

})( this, this.document );

var tutorial = new window.Tutorial();

/*
  Utilities
 */
// regex to remove an injected script in the head of makes
var uninjectScriptRegex = /<script>((.|\n)*)<\/script>\n<\/head/i;

/**
 * Get the source code for given url ONLY if it is a
 * known, public, Thimble make.
 *
 * @param  {String} url       A URL to check + fetch
 * @param  {[String]} apiURL  Optional: makeapi to check against
 * @return {Promise}          A promise which resolves for valid makes.
 */
function getValidMake( url, apiURL ) {
  'use strict';

  return new Promise( function( resolve, reject ) {
    var makeapi = new Make({
      apiURL: apiURL || 'https://makeapi.webmaker.org'
    });

    makeapi.url( url ).then( function( err, makes ) {
      if( err ) {
        return reject( err );
      }

      if( makes.length === 0 ) {
        return reject( new Error( 'No makes match given url: ' + url ) );
      }

      if( makes[ 0 ].contentType !== 'application/x-thimble' ) {
        return reject( new Error( 'Only works for Thimble makes right now.' ) );
      }

      // prep url for get using jQuery
      url = url.replace( /^https?:\/\//i, '' ) + '_';
      var getMake = $.get( 'http://www.corsproxy.com/' + url );

      // yay go the make html
      getMake.done( function( data ) {
        resolve( data, makes[ 0 ] );
      });

      // oh no it failed
      getMake.fail( function( jqXHR, textStatus, errorThrown ) {
        reject( errorThrown );
      });
    });
  });
}

/*
  Form handling
 */

// Do things only when DOM ready
$( function() {
  'use strict';

  var makeDetails = {};

  /*
    deal w/ get started form
   */
  $( '#get-started form' ).on( 'submit', function() {
    if( !$( '#make-url' ).val().trim() ) {
      return false;
    }

    $( '#get-started form .btn[type=submit]' ).append( ' <i class="fa fa-spinner fa-spin"></i>' );

    // attempt to get
    var getMake = getValidMake( $( '#make-url' ).val().trim() );

    getMake.then( function( data, make ) {
      console.log( make );
      makeDetails = make;

      // uninject the link fixing js
      var makeCode = data.replace( uninjectScriptRegex, '</head');

      // inject make code into our code pane
      $( '#make-code code' ).text( makeCode ).html();

      // highlight code
      Prism.highlightElement( $( '#make-code code' ).get( 0 ) );

      // show editor
      $( '#get-started' ).fadeOut( function() {
        $( '#editor' ).fadeIn();
        // change default focus element
        $( '#section-name' ).focus();
      });
    }, function( err ) {
      // there was some kind of error, let the user know
      $( '#get-started form .btn[type=submit] i.fa' ).remove();
      $( '#make-url' ).parents( '.form-group' ).addClass( 'has-error' ).append( '<p class="help-block error">' + err.message + '</p>' );
    });

    return false;
  });

  // remove errors if form updated
  $( '#get-started form' ).on( 'keypress', function() {
    $( this ).find( '.form-group' ).removeClass( 'has-error' );
    $( this ).find( '.help-block.error' ).remove();
  });

  // focus get started form on load
  $( '#make-url' ).focus();

  /*
    deal w/ preview
   */
  $( '#previewFrame' ).load( function() {
    // quick reference to iframe window obj
    var frame = this.contentWindow;

    /**
     * Send source code to overwrite whatever is in the
     * preview pane for the tutorial
     *
     * @param  {String} str New source code to render
     */
    function sendOverwrite( str ) {
      var message = {
        type: 'overwrite',
        sourceCode: str || '',
        runjs: true
      };

      frame.postMessage( JSON.stringify( message ), '*' );
    }
    // initial source to load (blank tut)
    sendOverwrite( nunjucks.render( 'templates/tutorial.html', {
      make: makeDetails
    } ) );

    /*
      deal w/ add section
     */
    $( '#new-section form' ).on( 'submit', function() {
      if( !$( '#section-name' ).val() && !$( '#section-content' ).val() ) {
        // must have values to submit
        console.log( 'fail' );
        return false;
      }

      tutorial.push({
        name: $( '#section-name' ).val().trim(),
        content: marked( $( '#section-content' ).val() )
      });

      // get something a little more like the template wants
      var sections = [];
      var rawSections = tutorial.getSections();
      tutorial.getOrder().forEach( function( id ) {
        sections.push( rawSections[ id ] );
      });

      // render the template w/ known sections (in order)
      var tutorialHtml = nunjucks.render( 'templates/tutorial.html', {
        sections: sections,
        make: makeDetails
      });

      // send the new source to the preview pane
      sendOverwrite( tutorialHtml );

      // reset the form for another section to be added
      $( '#section-name' ).val( '' );
      $( '#section-content' ).val( '' );

      // refocus on new section name
      $( '#section-name' ).focus();

      // prevent real submit
      return false;
    });

    /*
      Deal w/ done
     */
    $( '#tutorial-complete' ).on( 'click', function() {
      // add final details if given
      if( $( '#section-name' ).val() && $( '#section-content' ).val() ) {
        tutorial.push({
          name: $( '#section-name' ).val().trim(),
          content: marked( $( '#section-content' ).val() )
        });
      }

      // get something a little more like the template wants
      var sections = [];
      var rawSections = tutorial.getSections();
      tutorial.getOrder().forEach( function( id ) {
        sections.push( rawSections[ id ] );
      });

      // render the template w/ known sections (in order)
      var tutorialHtml = nunjucks.render( 'templates/tutorial.html', {
        sections: sections,
        make: makeDetails
      });

      console.log( makeDetails );

      // send the new source to the preview pane
      sendOverwrite( tutorialHtml );

      // hide form
      $( '#editor-tabs a:first' ).tab( 'show' );

      var newSectionTab = $( 'a[href=#new-section][role=tab]' );
      newSectionTab.parent( 'li' ).addClass( 'disabled' );
      newSectionTab.parent( 'li' ).html( '<a href="#">' + newSectionTab.text() + '</a>' );

      // scroll code to top (instant)
      $( '#make-code pre' ).scrollTop( 0 );

      // change code to be tut code
      $( '#make-code code' ).text( tutorialHtml ).html();
      Prism.highlightElement( $( '#make-code code' ).get( 0 ) );

      // add direction to copy the code into a make
      $( '#make-code' ).append( '<p class="text-muted">Copy + Paste the above code into a new Thimble project, and <a href="https://support.mozilla.org/kb/thimble-tutorials">follow the instructions here</a> to add this to your make.</p>' );
    });
  });
});

/*
  Replicate tutorial scroll to line functionality
 */
$( window ).on( 'message', function( event ) {
  'use strict';

  // get postMessage out of jq event
  try {
    var message = JSON.parse( event.originalEvent.data );

    if( message.type === 'tutorial' && message.action === 'scroll' ) {
      // get scroll amount
      var line = $( '#make-code .line-numbers-rows span' ).eq( message.lines.from - 1 );
      var offset = line.offset(); // offset relative to doc
      var offsetTop = offset.top - $( '#make-code pre' ).offset().top;

      // visually indicate line
      line.css({
        backgroundColor: '#27aae1'
      });
      // remove indication after 2secs
      setTimeout( function() {
        line.css({
          backgroundColor: 'transparent'
        });
      }, 2000 );

      // scroll to line
      $( '#make-code pre' ).animate({
        scrollTop: offsetTop
      });
    }
  }
  catch ( e ) {
    // do nothing w/ errors here
  }
});
