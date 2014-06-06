var assert = require('assert')
var cs = require('../')
var fixtures = require('./fixtures/coinstring')

describe('coinstring', function() {

  describe('+ encode()', function() {
    fixtures.valid.forEach(function(f) {
      it('should encode ' + f.description, function() {
        var inp = new Buffer(f.hex, 'hex')
        var version = parseInt(f.versionHex, '16')
        assert.equal(cs.encode(inp, version), f.base58)
        assert.equal(cs.encode([].slice.call(inp), version), f.base58)
        assert.equal(cs.encode(new Uint8Array([].slice.call(inp)), version), f.base58)
      })
    })
  })

  describe('+ decode()', function() {
    fixtures.valid.forEach(function(f) {
      it('should decode ' + f.description, function() {
        var version = parseInt(f.versionHex, '16')
        assert.equal(cs.decode(version, f.base58).bytes.toString('hex'), f.hex)
        assert.equal(cs.decode(f.base58).bytes.toString('hex'), f.hex)
      })
    })

    describe('> when invalid input', function() {
      fixtures.invalid.forEach(function(f) {
        it(f.description + ' should throw an error', function() {
          assert.throws(function() {
            var version = parseInt(f.versionHex, '16')
            assert(cs.decode(version, f.base58))
          })
        })
      })
    })
  })

  describe('+ validate()', function() {
    fixtures.valid.forEach(function(f) {
      it('should validate ' + f.description, function() {
        var version = parseInt(f.versionHex, '16')
        assert(cs.validate(version, f.base58))
      })
    })

    describe('> when invalid input', function() {
      fixtures.invalid.forEach(function(f) {
        it(f.description + ' should return false', function() {
          var version = parseInt(f.versionHex, '16')
          assert(!cs.validate(version, f.base58))
        })
      })
    })
  })

  describe('+ createEncoder()', function() {
    fixtures.valid.forEach(function(f) {
      it('should create an encoder ' + f.description, function() {
        var inp = new Buffer(f.hex, 'hex')
        var version = parseInt(f.versionHex, '16')

        var encode = cs.createEncoder(version)
        assert.equal(encode(inp), f.base58)
      })
    })
  })

  describe('+ createDecoder()', function() {
    fixtures.valid.forEach(function(f) {
      it('should create a decoder ' + f.description, function() {
        var inp = new Buffer(f.hex, 'hex')
        var version = parseInt(f.versionHex, '16')

        var decode = cs.createDecoder(version)
        assert.equal(decode(f.base58).bytes.toString('hex'), f.hex)
      })
    })
  })
})


