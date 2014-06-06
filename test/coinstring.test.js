var assert = require('assert')
var cs = require('../')
var fixtures = require('./fixtures/coinstring')

describe('coinstring', function() {

  describe('+ encode()', function() {
    fixtures.valid.forEach(function(f) {
      it('should encode ' + f.description, function() {
        var inp = new Buffer(f.hex, 'hex')
        var version = parseInt(f.version, '16')

        if (f.version.length < 4)  {//skip bip32 here
          assert.equal(cs.encode(inp, version), f.base58)
          assert.equal(cs.encode([].slice.call(inp), version), f.base58)
          assert.equal(cs.encode(new Uint8Array([].slice.call(inp)), version), f.base58)
        }

        version = new Buffer(f.version.substr(2), 'hex') //chop off '0x'
        assert.equal(cs.encode(inp, version), f.base58)
      })
    })
  })

  describe('+ decode()', function() {
    fixtures.valid.forEach(function(f) {
      it('should decode ' + f.description, function() {
        var version = parseInt(f.version, '16')
        var bufferVersion = new Buffer(f.version.substr(2), 'hex')
        var res = {}

        if (f.version.length < 4) { //skip bip32
          res = cs.decode(f.base58, version)
          assert.equal(res.payload.toString('hex'), f.hex)
          assert.equal(res.version.toString('hex'), f.version.substr(2))
          res = cs.decode(f.base58)
          assert.equal(res.payload.toString('hex'), f.hex)
          assert.equal(res.version.toString('hex'), f.version.substr(2))
        } 

        res = cs.decode(f.base58, bufferVersion)
        assert.equal(res.payload.toString('hex'), f.hex)
        assert.equal(res.version.toString('hex'), f.version.substr(2))
      })
    })

    describe('> when invalid input', function() {
      fixtures.invalid.forEach(function(f) {
        it(f.description + ': ' + f.base58 + ' should throw an error', function() {
          assert.throws(function() {
            var version = parseInt(f.version, '16')
            assert(cs.decode(f.base58, version))
          },new RegExp(f.match, 'i'))
        })
      })
    })
  })

  describe('+ isValid()', function() {
    fixtures.valid.forEach(function(f) {
      it('should validate ' + f.description, function() {
        var version = parseInt(f.version, '16')
        var versionBuffer = new Buffer(f.version.substr(2), 'hex')
        if (f.version.length < 4) //skip bip 32
          assert(cs.isValid(f.base58, version))
        assert(cs.isValid(f.base58, versionBuffer))
      })
    })

    describe('> when invalid input', function() {
      fixtures.invalid.forEach(function(f) {
        it(f.description + ' should return false', function() {
          var version = parseInt(f.version, '16')
          assert(!cs.isValid(f.base58, version))
        })
      })
    })
  })

  describe('+ createEncoder()', function() {
    fixtures.valid.forEach(function(f) {
      it('should create an encoder ' + f.description, function() {
        var inp = new Buffer(f.hex, 'hex')
        var version = parseInt(f.version, '16')
        var versionBuffer = new Buffer(f.version.substr(2), 'hex')

        if (f.version.length < 4) {//skip bip 32
          var encode = cs.createEncoder(version)
          assert.equal(encode(inp), f.base58)
        }

        encode = cs.createEncoder(versionBuffer)
        assert.equal(encode(inp), f.base58)
      })
    })
  })

  describe('+ createDecoder()', function() {
    fixtures.valid.forEach(function(f) {
      it('should create a decoder ' + f.description, function() {
        var inp = new Buffer(f.hex, 'hex')
        var version = parseInt(f.version, '16')
        var versionBuffer = new Buffer(f.version.substr(2), 'hex')

        if (f.version.length < 4) { //skip bip 32
          var decode = cs.createDecoder(version)
          assert.equal(decode(f.base58).payload.toString('hex'), f.hex)
        }

        decode = cs.createDecoder(versionBuffer)
        assert.equal(decode(f.base58).payload.toString('hex'), f.hex)
      })
    })
  })

  describe('+ createValidator()', function() {
    fixtures.valid.forEach(function(f) {
      it('should create a validator ' + f.description, function() {
        var version = parseInt(f.version, '16')
        var versionBuffer = new Buffer(f.version.substr(2), 'hex')
        if (f.version.length < 4) { //skip bip 32
          var isValid = cs.createValidator(version)
          assert(isValid(f.base58))
        }

        isValid = cs.createValidator(versionBuffer)
        assert(isValid(f.base58))
      })
    })

    describe('> when invalid input', function() {
      fixtures.invalid.forEach(function(f) {
        it(f.description + ' should return false', function() {
          var version = parseInt(f.version, '16')
          var versionBuffer = new Buffer(f.version.substr(2), 'hex')

          if (f.version.length < 4) { //skip bip 32
            var isValid = cs.createValidator(version)
            assert(!isValid(f.base58))
          }

          isValid = cs.createValidator(versionBuffer)
          assert(!isValid(f.base58))
        })
      })
    })
  })
})


