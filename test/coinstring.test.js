var assert = require('assert')
var cs = require('../')
var fixtures = require('./fixtures/coinstring')

/* global describe, it */

describe('coinstring', function () {
  describe('+ encode()', function () {
    fixtures.valid.forEach(function (f) {
      it('should encode ' + f.description, function () {
        if (f.version) {
          var inp = new Buffer(f.hex, 'hex')
          var version = parseInt(f.version, 16)
          var versionBuffer = new Buffer(f.version.substr(2), 'hex') // chop off '0x'

          if (f.version.length <= 4) {// skip bip32 here
            assert.equal(cs.encode(inp, version), f.base58)
            assert.equal(cs.encode([].slice.call(inp), version), f.base58)
            assert.equal(cs.encode(new Uint8Array([].slice.call(inp)), version), f.base58)
          }

          assert.equal(cs.encode(inp, versionBuffer), f.base58)
        } else {
          assert.equal(cs.encode(new Buffer(f.hex, 'hex')), f.base58)
        }
      })
    })

    describe('> when no version', function () {
      it('should still encode it', function () {
        var f = fixtures.valid[0]
        var inp = new Buffer(f.hex, 'hex')
        var version = new Buffer(f.version.substr(2), 'hex')
        var payload = Buffer.concat([version, inp])
        assert.equal(cs.encode(payload), f.base58)
      })
    })
  })

  describe('+ decode()', function () {
    fixtures.valid.forEach(function (f) {
      it('should decode ' + f.description, function () {
        if (f.version) {
          var version = parseInt(f.version, 16)
          var bufferVersion = new Buffer(f.version.substr(2), 'hex')
          var res = {}

          if (f.version.length <= 4) { // skip bip32
            res = cs.decode(f.base58, version)
            assert.equal(res.toString('hex'), f.hex)

            res = cs.decode(f.base58)
            // must slice off version
            assert.equal(res.slice(bufferVersion.length).toString('hex'), f.hex)
          }

          res = cs.decode(f.base58, bufferVersion)
          assert.equal(res.toString('hex'), f.hex)
        } else { // f.version == null
          assert.equal(cs.decode(f.base58).toString('hex'), f.hex)
        }
      })
    })

    describe('> when invalid input', function () {
      fixtures.invalid.forEach(function (f) {
        it(f.description + ': ' + f.base58 + ' should throw an error', function () {
          assert.throws(function () {
            var version = parseInt(f.version, 16)
            assert(cs.decode(f.base58, version))
          }, new RegExp(f.match, 'i'))
        })
      })
    })
  })

  describe('+ isValid()', function () {
    fixtures.valid.forEach(function (f) {
      it('should validate ' + f.description, function () {
        if (f.version == null) return // can't check isValid if no version

        var version = parseInt(f.version, 16)
        var versionBuffer = new Buffer(f.version.substr(2), 'hex')
        if (f.version.length <= 4) { // skip bip 32
          assert(cs.isValid(f.base58, version))
        }
        assert(cs.isValid(f.base58, versionBuffer))
      })
    })

    describe('> when invalid input', function () {
      fixtures.invalid.forEach(function (f) {
        it(f.description + ' should return false', function () {
          var version = parseInt(f.version, 16)
          assert(!cs.isValid(f.base58, version))
        })
      })
    })
  })

  describe('+ createEncoder()', function () {
    fixtures.valid.forEach(function (f) {
      it('should create an encoder ' + f.description, function () {
        if (f.version == null) return // can't create decoder if no version

        var inp = new Buffer(f.hex, 'hex')
        var version = parseInt(f.version, 16)
        var versionBuffer = new Buffer(f.version.substr(2), 'hex')

        if (f.version.length <= 4) {// skip bip 32
          var encode = cs.createEncoder(version)
          assert.equal(encode(inp), f.base58)
        }

        encode = cs.createEncoder(versionBuffer)
        assert.equal(encode(inp), f.base58)
      })
    })
  })

  describe('+ createDecoder()', function () {
    fixtures.valid.forEach(function (f) {
      it('should create a decoder ' + f.description, function () {
        if (f.version == null) return // can't create decoder if no version

        // var inp = new Buffer(f.hex, 'hex')
        var version = parseInt(f.version, 16)
        var versionBuffer = new Buffer(f.version.substr(2), 'hex')

        if (f.version.length <= 4) { // skip bip 32
          var decode = cs.createDecoder(version)
          assert.equal(decode(f.base58).toString('hex'), f.hex)
        }

        decode = cs.createDecoder(versionBuffer)
        assert.equal(decode(f.base58).toString('hex'), f.hex)
      })
    })
  })

  describe('+ createValidator()', function () {
    fixtures.valid.forEach(function (f) {
      it('should create a validator ' + f.description, function () {
        if (f.version == null) return // can't create validator if no version

        var version = parseInt(f.version, 16)
        var versionBuffer = new Buffer(f.version.substr(2), 'hex')
        if (f.version.length <= 4) { // skip bip 32
          var isValid = cs.createValidator(version)
          assert(isValid(f.base58))
        }

        isValid = cs.createValidator(versionBuffer)
        assert(isValid(f.base58))
      })
    })

    describe('> when invalid input', function () {
      fixtures.invalid.forEach(function (f) {
        it(f.description + ' should return false', function () {
          var version = parseInt(f.version, 16)
          var versionBuffer = new Buffer(f.version.substr(2), 'hex')

          if (f.version.length <= 4) { // skip bip 32
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
