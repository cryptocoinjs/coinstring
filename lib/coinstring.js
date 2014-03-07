var sha256 = require('crypto-hashing').sha256;
var base58 = require('bs58');

module.exports = coinstring

coinstring.validate = validate;
coinstring.decode = decode;


function coinstring(version, bytes) {
  var version = new Buffer([version]);
  var buf = Buffer.concat([version, bytes]);
  var checksum = sha256.x2(buf).slice(0, 4);
  var result = Buffer.concat([version, bytes, checksum]);
  return base58.encode(result);
}

function decode(version, str) {
  var buf = base58.decode(str);

  if (buf[0] !== version)
    throw new Exception('Invalid version.');

  var checksum = buf.slice(-4);
  var endPos = buf.length - 4;
  var bytes = buf.slice(0, endPos);

  var newChecksum = sha256.x2(bytes).slice(0, 4);
  if (checksum.toString('hex') !== newChecksum.toString('hex'))
    throw new Exception('Invalid checksum.');

  return bytes.slice(1);
}

function validate(version, input) {
  try {
    decode(version, input);
  } catch (e) {
    return false;
  }

  return true;
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