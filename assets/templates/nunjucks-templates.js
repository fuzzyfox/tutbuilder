(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["assets/templates/tutorial.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<!doctype html>\n<html>\n  <head>\n    <meta charset=\"utf-8\">\n    <title>";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "make")),"title", env.autoesc)?"Tutorial for " + runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "make")),"title", env.autoesc):"Tutorial"), env.autoesc);
output += "</title>\n\n    <!-- these styles make your tutorial look beautiful -->\n    <link rel=\"stylesheet\" href=\"//stuff.webmaker.org/makerstrap/v0.1.7/makerstrap.complete.min.css\">\n\n    <link href=\"//thimble.webmaker.org/learning_projects/tutorial/tutorial.css\" rel=\"stylesheet\">\n\n    <!-- these scripts turn your make into a tutorial -->\n    <script src=\"//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js\"></script>\n    <script src=\"//thimble.webmaker.org/learning_projects/tutorial/tutorial.js\"></script>\n    <script>\n      jQuery( document ).ready( function( $ ) {\n        $( 'body' ).tutorial();\n      });\n    </script>\n  </head>\n  <body>\n    ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "sections");
if(t_3) {for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("section", t_4);
output += "\n    <section>\n      <!-- ";
output += runtime.suppressValue(runtime.memberLookup((t_4),"name", env.autoesc), env.autoesc);
output += " -->\n      ";
output += runtime.suppressValue(runtime.memberLookup((t_4),"content", env.autoesc), env.autoesc);
output += "\n    </section>\n    ";
;
}
}
frame = frame.pop();
output += "\n  </body>\n</html>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
