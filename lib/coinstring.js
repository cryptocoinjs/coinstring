var crypto = require('crypto')
var base58 = require('bs58')

function encode(version, bytes) {
  if (bytes == null) {
    return function(bytes) {
      return encode(version, bytes)
    }
  }

  if (Array.isArray(bytes) || bytes instanceof Uint8Array)
    bytes = new Buffer(bytes)

  var version = new Buffer([version])
  var buf = Buffer.concat([version, bytes])
  var checksum = sha256x2(buf).slice(0, 4)
  var result = Buffer.concat([version, bytes, checksum])
  return base58.encode(result)
}

function decode(version, str) {
  if (arguments.length === 1) {
    if (typeof arguments[0] == 'string') { //string passed
      str = arguments[0]
      version = null
    }
  }

  if (str == null) {
    return function(str) {
      return decode(version, str)
    }
  }

  var buf = base58.decode(str)

  if (version != null)
    if (buf[0] !== version)
      throw new Error('Invalid version.')

  var checksum = buf.slice(-4)
  var endPos = buf.length - 4
  var bytes = buf.slice(0, endPos)

  var newChecksum = sha256x2(bytes).slice(0, 4)
  if (checksum.toString('hex') !== newChecksum.toString('hex'))
    throw new Error('Invalid checksum.')

  return {version: bytes[0], bytes: bytes.slice(1)}
}

function validate(version, input) {
  if (input == null) {
    return function(input) {
      return validate(version, input)
    }
  }

  try {
    decode(version, input)
  } catch (e) {
    return false
  }

  return true
}

function sha256x2(buffer) {
  var sha = crypto.createHash('sha256').update(buffer).digest()
  return crypto.createHash('sha256').update(sha).digest()
}

module.exports = {
  encode: encode,
  decode: decode,
  validate: validate
}

