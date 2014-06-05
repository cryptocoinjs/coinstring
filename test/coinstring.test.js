var assert = require('assert')

var coinstring = require('../')
var conv = require('binstring')


describe('coinstring', function() {
  var privateKeyHex = "1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd"
  var privateKeyHexBuf = conv(privateKeyHex, {in: 'hex', out: 'buffer'})
  var privateKeyHexCompressed = privateKeyHex + "01" //<--- compression involves appending 0x01 to end
  var privateKeyHexCompressedBuf = conv(privateKeyHexCompressed, {in: 'hex', out: 'buffer'})
  var hash160 = "3c176e659bea0f29a3e9bf7880c112b1b31b4dc8" //hash representing uncompressed
  var hash160Buf = conv(hash160, {in: 'hex', out: 'buffer'})
  var hash160c = "a1c2f92a9dacbd2991c3897724a93f338e44bdc1" //hash representing compressed
  var hash160cBuf = conv(hash160c, {in: 'hex', out: 'buffer'})

  describe('> when all arguments are passed', function() {
    describe('> when Bitcoin', function() {
      var address = "16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS"
      var addressCompressed = '1FkKMsKNJqWSDvTvETqcCeHcUQQ64kSC6s'
      var wif = "5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD"
      var wifCompressed = 'KwomKti1X3tYJUUMb1TGSM2mrZk1wb1aHisUNHCQXTZq5auC2qc3'

      describe('> when public', function() {
        var version = 0x0 //bitcoin public / pubkeyhash

        it('coinstring should generate the public address', function() {
          assert.equal(coinstring(version, hash160Buf), address)
          assert.equal(coinstring(version, hash160cBuf), addressCompressed)          
        })

        it('validate should validate the address', function() {
          assert(coinstring.validate(version, address))
          assert(coinstring.validate(version, addressCompressed))  
        })

        it('decode should parse the address and return the hash160', function() {
          assert.equal(coinstring.decode(version, address).bytes.toString('hex'), hash160)
          assert.equal(coinstring.decode(version, addressCompressed).bytes.toString('hex'), hash160c)   
        })
      })

      describe('> when private', function() {
        var version = 0x80 //bitcoin private key

        describe('> when input is an array to coinstring', function() {
          it('should generate the WIF', function() {
            var arr = conv(privateKeyHex, {in: 'hex', out: 'bytes'})
            assert(Array.isArray(arr))
            assert.equal(coinstring(version, arr), wif)
          })
        })

        describe('> when input is an Uint8Array to coinstring', function() {
          it('should generate the WIF', function() {
            var arr = conv(privateKeyHex, {in: 'hex', out: 'bytes'})
            arr = new Uint8Array(arr)
            assert(arr instanceof Uint8Array)
            assert.equal(coinstring(version, arr), wif)
          })
        })

        it('coinstring should generate the WIF', function() {
          assert.equal(coinstring(version, privateKeyHexBuf), wif)
          assert.equal(coinstring(version, privateKeyHexCompressedBuf), wifCompressed)
        })

        it('validate should validate the address', function() {
          assert(coinstring.validate(version, wif))
          assert(coinstring.validate(version, wifCompressed))  
        })

        it('decode should parse the address and return the hash160', function() {
          assert.equal(coinstring.decode(version, wif).bytes.toString('hex'), privateKeyHex)
          assert.equal(coinstring.decode(version, wifCompressed).bytes.toString('hex'), privateKeyHexCompressed)   
        })
      })
    })

    describe('> when Dogecoin', function() {
      var address = "DAcq9oJpZZAjr56RmF7Y5zmWboZWQ4HAsW"
      var addressCompressed = 'DKtQu8G1cFQikveWy3qAkQTDMY8PKVU18Z'
      var wif = "6JGLNEiEYR6pFGq84gwceHWYLcyKaLWzaymVajjCPPUEGAR2MTT"
      var wifCompressed = 'QPCgUjWzmfNfXzsQBHJ4KZsPKbmaz99PAyZP9ubFFpBBXWuSQh6n'

      describe('> when public', function() {
        var version = 0x1E //dogecoin public / pubkeyhash

        it('coinstring should generate the public address', function() {
          assert.equal(coinstring(version, hash160Buf), address)
          assert.equal(coinstring(version, hash160cBuf), addressCompressed)          
        })

        it('validate should validate the address', function() {
          assert(coinstring.validate(version, address))
          assert(coinstring.validate(version, addressCompressed))  
        })

        it('decode should parse the address and return the hash160', function() {
          assert.equal(coinstring.decode(version, address).bytes.toString('hex'), hash160)
          assert.equal(coinstring.decode(version, addressCompressed).bytes.toString('hex'), hash160c)   
        })
      })

      describe('> when private', function() {
        var version = 0x1E + 0x80 //dogecoin private key

        it('coinstring should generate the WIF', function() {
          assert.equal(coinstring(version, privateKeyHexBuf), wif)
          assert.equal(coinstring(version, privateKeyHexCompressedBuf), wifCompressed)
        })

        it('validate should validate the address', function() {
          assert(coinstring.validate(version, wif))
          assert(coinstring.validate(version, wifCompressed))  
        })

        it('decode should parse the address and return the hash160', function() {
          assert.equal(coinstring.decode(version, wif).bytes.toString('hex'), privateKeyHex)
          assert.equal(coinstring.decode(version, wifCompressed).bytes.toString('hex'), privateKeyHexCompressed)   
        })
      })
    })
  })

  describe('> when input is invalid', function() {
    it('validate should return false', function() {
      var address = "16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS"
      var wif = "5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD"

      assert(!coinstring.validate(0x0, address.toLowerCase()))
      assert(!coinstring.validate(0x80, wif.toLowerCase()))
    })
  
    it('decode should throw an exception', function() {
      var address = "16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS"
      var wif = "5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD"

      assert.throws(function() { coinstring.decode(0x0, address.toLowerCase()) })
      assert.throws(function() { coinstring.decode(0x80, wif.toLowerCase()) })
      assert.throws(function() { coinstring.decode(0x1, address) })
      assert.throws(function() { coinstring.decode(0x2, wif) })
    })
  })

  describe('> when version is specified', function() {
    it('coinstring should partially be applied', function() {
      var btcWif = "5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD"
      var toBtcWif = coinstring(0x80)
      assert.equal(toBtcWif(privateKeyHexBuf), btcWif)
    })

    it('decode should partially be applied', function() {
      var btcWif = "5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD"
      var fromBtcWif = coinstring.decode(0x80)
      assert.equal(fromBtcWif(btcWif).bytes.toString('hex'), privateKeyHex)
    })

    it('validate should partially be applied', function() {
      var address = "16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS"
      var btcAddressValidator = coinstring.validate(0x0)
      assert(btcAddressValidator(address))
      assert(!btcAddressValidator(address.toUpperCase()))
    })
  })

  describe('- decode()', function() {
    describe('> when version isnt passed', function() {
      it('should still work', function() {
        var wifCompressed = 'KwomKti1X3tYJUUMb1TGSM2mrZk1wb1aHisUNHCQXTZq5auC2qc3'
        var res = coinstring.decode(wifCompressed)
        assert.equal(res.bytes.toString('hex'), privateKeyHexCompressed)
        assert.equal(res.version, 0x80)
      })
    })
  })
})


