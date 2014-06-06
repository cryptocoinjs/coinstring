var assert = require('assert')
var cs = require('../')
var fixtures = require('./fixtures/coinstring')

describe('coinstring', function() {

  describe('+ encode()', function() {
    fixtures.valid.forEach(function(f) {
      it('should encode ' + f.description, function() {
        var inp = new Buffer(f.hex, 'hex')
        var version = parseInt(f.versionHex, '16')
        assert.equal(cs.encode(version, inp), f.base58)
        assert.equal(cs.encode(version, [].slice.call(inp)), f.base58)
        assert.equal(cs.encode(version, new Uint8Array([].slice.call(inp))), f.base58)
      })
    })
  })

  describe('+ decode()', function() {
    fixtures.valid.forEach(function(f) {
      it('should decode ' + f.description, function() {
        var version = parseInt(f.versionHex, '16')
        assert.equal(cs.decode(version, f.base58).bytes.toString('hex'), f.hex)
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

  var privateKeyHex = fixtures.valid[0].hex
  var privateKeyHexBuf = new Buffer(privateKeyHex, 'hex')
  var privateKeyHexCompressed = privateKeyHex + "01" //<--- compression involves appending 0x01 to end


  describe('> when version is specified', function() {
    it('coinstring should partially be applied', function() {
      var btcWif = "5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD"
      var toBtcWif = cs.encode(0x80)
      assert.equal(toBtcWif(privateKeyHexBuf), btcWif)
    })

    it('decode should partially be applied', function() {
      var btcWif = "5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD"
      var fromBtcWif = cs.decode(0x80)
      assert.equal(fromBtcWif(btcWif).bytes.toString('hex'), privateKeyHex)
    })

    it('validate should partially be applied', function() {
      var address = "16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS"
      var btcAddressValidator = cs.validate(0x0)
      assert(btcAddressValidator(address))
      assert(!btcAddressValidator(address.toUpperCase()))
    })
  })

  describe('- decode()', function() {
    describe('> when version isnt passed', function() {
      it('should still work', function() {
        var wifCompressed = 'KwomKti1X3tYJUUMb1TGSM2mrZk1wb1aHisUNHCQXTZq5auC2qc3'
        var res = cs.decode(wifCompressed)
        assert.equal(res.bytes.toString('hex'), privateKeyHexCompressed)
        assert.equal(res.version, 0x80)
      })
    })
  })
})


