var source = "(typeof window.addStyle === 'function') || (window.addStyle = function(style){\
  var cssNode = document.createElement('style');\
  cssNode.setAttribute('type', 'text/css');\
  if(cssNode.styleSheet){\
    cssNode.styleSheet.cssText = style;\
  }else{\
    cssNode.appendChild(document.createTextNode(style));\
  }\
  document.getElementsByTagName('head')[0].appendChild(cssNode);\
});"

var chalk = require('chalk')
  , UglifyJS = require('uglify-js')
  , addStyle = UglifyJS.minify(source, {fromString: true}).code
  ;

module.exports = function(grunt){
  grunt.registerMultiTask('inline_css', 'insert css to js file', function(){
    var options
      , main
      , mainContent
      , replace
      , total = 0
      ;

    options = this.options();

    main = (options.main && grunt.file.exists(options.main)) ?
      options.main :
      false;

    if(main){
      mainContent = grunt.file.read(main);
      mainContent = mainContent + '\n' + addStyle;
      grunt.file.write(main, mainContent);
    }

    this.files.forEach(function(f){
      var src = f.src.filter(function(filePath){
        if(!grunt.file.exists(filePath)){
          grunt.log.warn('Source file ' + chalk.cyan(filePath) + ' not found');
          return false;
        }else{
          return true;
        }
      });

      // replace name
      if(options.replace && typeof options === 'function'){
        f.dest = options.replace(f.dest);
      }

      if(src.length === 0){
        grunt.log.warn('Destination ' + chalk.cyan(f.dest) + ' not written because src files were empty.');
      }

      if(!grunt.file.exists(f.dest)){
        return;
      }

      var cssContent = ''
        , jsContent = ''
        , prefix = ''
        , output = ''
        ;

      src.forEach(function(cssFile){
        cssContent += grunt.file.read(cssFile);
      });

      jsContent = grunt.file.read(f.dest);

      if(!main){
        prefix = addStyle;
      }

      output += prefix;
      output += 'addStyle("';
      output += cssContent;
      output += '");\n';
      output += jsContent;

      grunt.file.write(f.dest, output);

      total ++;

      grunt.log.ok('Inlined ' + chalk.cyan(f.dest));
    });

    if(total > 0){
      grunt.log.ok('Inlined ' + chalk.cyan(total) + ' files');
    }

  });
};