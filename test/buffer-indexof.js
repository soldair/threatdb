var biof = require('../lib/buffer-indexof')
, test = require('tape')
;

test("can find stuff in buffers",function(t){
  var search = new Buffer('apple');
  
  var idx = biof(new Buffer('i ate an apple for lunch'),search)

  t.equals(idx,9,' apples is in the buffer at offset 9');

  t.end();

})




