// logserver-manifest

var fs = require('fs')
, path = require('path')
, split = require('split')
, time = require('monotonic-timestamp')
, uuid = require('uuid')
, parseLog = require('./parselog')
, log = require('./log')


module.exports = function(path,cb){
  var m =  new Manifest(path);  
  m.open(function(err){
    cb(err,m)
  });
}


function Manifest(path){
  this.path = path;
}

Manifest.prototype ={
  path:false,
  ws:false,
  name:'manifest.log',
  data:{
    intermediateLog:false,
    logs:{}
  },
  open:function(cb){
    if(this.ws) return setImmediate(cb);
    var z = this

    var last = false
    , ended = false
    , end = function(err,last){
      if(ended) return;

      ended = 1;
      if(err && err.code != 'ENOENT') return cb(err);

      if(last) {
        z.data.intermediateLog = last.intermediateLog;
        z.data.logs = last.logs;
      }

      // write new manifest
      var name = time()+z.name;

      var ws = fs.createWriteStream(path.join(z.path,name),'a+');
      ws.on('error',function(err){
        return cb(err);
      });

      ws.write(JSON.stringify(z.data)+"\n",function(err,bytes){
        if(err) return cb(err);
        // replace old.
        z.ws = ws;
        fs.rename(path.join(z.path,name),path.join(z.path,z.name),function(err){
          cb(err);
        })
      });
    }
    
    fs.createReadStream(this.path+"/"+this.name).on('error',function(err){
      end(err);
    }).pipe(parseLog()).on('data',function(data){
      end(false,data);
    }).on('error',function(err){
      end(err);
    });

    return;

  },
  add:function(){

  },
  openLog:function(){

  },
  getLog:function(){

  },
  getWriteLog:function(){

  },
  getNewLog:function(){
    if(!this.ws) throw new Error('database must be open before getting a new log file.');

    var l = {id:uuid(),t:time(),immutable:false};

    fs.createWriteStream("");
    logs[id] = l;
    ws.write(JSON.stringify(this.data)); 
    return l;
  }
}
