var fs = require('fs')
var through = require('through2');
var split = require('split');

module.exports = function(stream){
  var out = through(function(l){
    try{
      o = JSON.parse(l);
      this.queue(o);
    } catch (e) {
      this.emit('json_error',l,e);
    }
  });

  var s = split();

  s.on('error',function(){
    // handle in out
  }).pipe(out);

  // read through the manifest and figure out everything i know about.
  return s;

}

