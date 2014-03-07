var sha256 = require('crypto-hashing').sha256;
var base58 = require('bs58');

module.exports = coinstring

function coinstring(version, bytes) {
  var version = new Buffer([version]);
  var buf = Buffer.concat([version, bytes]);
  var checksum = sha256.x2(buf).slice(0, 4);
  var result = Buffer.concat([version, bytes, checksum]);
  return base58.encode(result);
}

function decode(version, str) {
  var buf = base58.decode(result);

}

function coinstringImpl(version, bytes) {
  
}

function partial(fn) {
  var args = Array.prototype.slice.call(arguments);
  var fn = args.shift();
  return function(){
    var arg = 0;
    for (var i = 0; i < args.length && arg < arguments.length; i++) {
      if ( args[i] === undefined )
        args[i] = arguments[arg++];
    }
    return fn.apply(this, args);
  }
}