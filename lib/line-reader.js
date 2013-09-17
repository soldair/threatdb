var blockReader = require('./block-reader')
, bufferIndexOf = require('./buffer-indexof')
, fs = require('fs')

// parse a block into lines and fragment
module.exports = function(fd,size,blockSize){
  
  var i = blockReader(fd,size,blockSize);

  var out = {
    blockSize:blockSize,
    length:i.length,
    size:function(bytes){
      i.size(bytes);
      this._size = i._size;
      this.length = i.length; 
      return this._size;
    },
    read:function(blk,cb){
      var z = this;
      i.read(blk,function(err,buf){
        if(err) return cb(err);

        console.log('read block: ',buf);

        var search = -1
        , lines = []
        , start = null
        , end = null
        , loops = 0
        ;

        while((search = bufferIndexOf(buf,nlBuf)) > -1){
          // no starting fragment if its the first block in the file
          if(!start && blk != 0) start = buf.slice(0,search);
          lines.push(buf.slice(0,search))
          buf = buf.slice(search);
          ++loops;
        }
        // if i have any buffer remaining
        // there is a race condition where the size may have changed since the read.
        if(buf.length) {
          if(!loops) start = buf
          //else if(blk != z.length-1) end = buf;
          else end = buf;
        }

        cb(false,{
          lines:lines,
          fragments:{
            start:start,
            end:end
          }
        });       
        
      });
    }
  }
  
  return out;
}

module.exports.loadFile = function(path,blockSize,cb){
  fs.stat(path,function(err,stat){
    if(err) return cb(err);
    fs.open(path,'r',function(err,fd){
      if(err) return cb(err);
      cb(false,module.exports(fd,stat.size,blockSize));
    })
  })
}

var nlBuf = new Buffer("\n");



