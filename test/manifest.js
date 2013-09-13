var test = require('tape')
, path = require('path')
, manifest = require('../lib/manifest')

test('can load manifest',function(t){
  
  manifest(path.join(__dirname,'db'),function(err,manifest){

    t.error(err,'should not have error opening manifest');
    t.end();

  })
  

});
