var test = require('tape')
var lr = require('../lib/line-reader.js');
var file = __dirname+'/file.txt';


test('can read blocks and get parsed lines',function(t){
  lr.loadFile(file,10,function(err,reader){
    reader.read(0,function(err,lineData){
      var bytes = 0;
      lineData.lines.forEach(function(l){
        bytes += l.length;
      })

      bytes += lineData.fragments.end.length;

      t.equals(lineData.lines[0].toString(),'123\n','should have the correct data in lines');

      t.equals(bytes,10,'reading an offset of 10 i should return 10 bytes');
      t.ok(!lineData.fragments.start,"offset zero should not have start fragment");
      t.end();
    });
  });
});
