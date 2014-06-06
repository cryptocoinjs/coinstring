var crypto = require('crypto')
var base58 = require('bs58')

function encode(payload, version) {
  if (Array.isArray(payload) || payload instanceof Uint8Array)
    payload = new Buffer(payload)

  if (version == null)
    version = 0x0 //Bitcoin public address by default

  var version = new Buffer([version])
  var buf = Buffer.concat([version, payload])
  var checksum = sha256x2(buf).slice(0, 4)
  var result = Buffer.concat([version, payload, checksum])
  return base58.encode(result)
}

function decode(base58str, version) {
  var buf = base58.decode(base58str)

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

function validate(base58str, version) {
  try {
    decode(base58str, version)
  } catch (e) {
    return false
  }

  return true
}

function createEncoder(version) {
  return function(bytes) {
    return encode(bytes, version)
  }
}

function createDecoder(version) {
  return function(bytes) {
    return decode(bytes, version)
  }
}

function createValidator(version) {
  return function(base58str) {
    return validate(base58str, version)
  }
}

function sha256x2(buffer) {
  var sha = crypto.createHash('sha256').update(buffer).digest()
  return crypto.createHash('sha256').update(sha).digest()
}

module.exports = {
  encode: encode,
  decode: decode,
  validate: validate,
  createEncoder: createEncoder,
  createDecoder: createDecoder,
  createValidator: createValidator
}

