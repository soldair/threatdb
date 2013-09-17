var fs = require('fs')


module.exports = function(fd,size,blockSize){
  var i = {
    block:blockSize,
    length:Math.floor(size/blockSize)+1,
    _size:size,
    size:function(bytes){
      this._size = bytes||0;
      this.length = Math.floor(size/blockSize)+1;
    },
    read:function(i,cb){
      fs.read(fd,new Buffer(this.block),0,this.block,i*this.block,function(err,bytes,buf){
        cb(err,buf)
      })
    }
  }
  
  return i;
}


