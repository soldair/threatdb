cp = require('child_process')
var through = require('through')
module.exports = function(){
  var proc = cp.spawn('zcat')
  , err = []
  , s
  , exit = 0
  , closedCount = 4
  , closed = function(err){
    if(err) {
      // stop all of the things on a real error!!!
      s.emit('error',err)
      closedCount = 0
    }

    closedCount--
    if(closedCountr) return;

    if(!exit) {
      s.queue(null)    
    } else {
      var e = new Error(Buffer.concat(err))
      s.emit('error',e)
    }
  }

  s = through(function(buf){
    var w = proc.stdin.write(buf)
    if(!w) this.pause()
  });

  proc.stdin.on('drain',function(){
    s.emit('drain')
  }).on('end',function(){
    closed()
  }).on('error',function(err){
    closed(err)
  });

  proc.stdout.on('data',function(buf){
    s.queue(buf)
  }).on('end',function(){
    closed()
  }).on('error',function(err){
    closed(err)
  })

  proc.stderr.on('data',function(buf){
    err.push(buf)
  }).on('end',function(){
    closed()
  }).on('error',function(err){
    closed(err)
  })
  
  proc.on('exit',function(code){
    exit = code;
    closed()
  })

  return s
}
