var test = require('tape')
var lr = require('../lib/line-reader.js');
var file = __dirname+'/file.txt';


test('can read blocks and get parsed lines',function(t){
  lr.loadFile(file,4,function(err,reader){
    reader.read(0,function(err,lineData){
      console.log(lineData);
      t.end();
    });
  });
});
