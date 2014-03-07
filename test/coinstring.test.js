var coinstring = require('../')
var conv = require('binstring');

require('terst');


describe('coinstring', function() {
  describe('> when all arguments are passed', function() {
    describe('> when Bitcoin', function() {
      var hash160 = "3c176e659bea0f29a3e9bf7880c112b1b31b4dc8"; //hash representing uncompressed
      var hash160Buf = conv(hash160, {in: 'hex', out: 'buffer'});
      var hash160c = "a1c2f92a9dacbd2991c3897724a93f338e44bdc1"; //hash representing compressed
      var hash160cBuf = conv(hash160c, {in: 'hex', out: 'buffer'});
      var address = "16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS"
      var addressCompressed = '1FkKMsKNJqWSDvTvETqcCeHcUQQ64kSC6s';
      var privateKeyHex = "1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd";
      var privateKeyHexBuf = conv(privateKeyHex, {in: 'hex', out: 'buffer'});
      var privateKeyHexCompressed = privateKeyHex + "01"; //<--- compression involves appending 0x01 to end
      var privateKeyHexCompressedBuf = conv(privateKeyHexCompressed, {in: 'hex', out: 'buffer'});
      var wif = "5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD"
      var wifCompressed = 'KwomKti1X3tYJUUMb1TGSM2mrZk1wb1aHisUNHCQXTZq5auC2qc3';

      describe('> when public', function() {
        var version = 0x0 //bitcoin public / pubkeyhash

        it('coinstring should generate the public address', function() {
          EQ (coinstring(version, hash160Buf), address);
          EQ (coinstring(version, hash160cBuf), addressCompressed);          
        })

        it('validate should validate the address', function() {
          T (coinstring.validate(version, address));
          T (coinstring.validate(version, addressCompressed));  
        })

        it('decode should parse the address and return the hash160', function() {
          EQ (coinstring.decode(version, address).toString('hex'), hash160);
          EQ (coinstring.decode(version, addressCompressed).toString('hex'), hash160c);   
        })
      })

      describe('> when private', function() {
        var version = 0x80 //bitcoin private key

        it('coinstring should generate the WIF', function() {
          EQ (coinstring(version, privateKeyHexBuf), wif);
          EQ (coinstring(version, privateKeyHexCompressedBuf), wifCompressed);
        })

        it('validate should validate the address', function() {
          T (coinstring.validate(version, wif));
          T (coinstring.validate(version, wifCompressed));  
        })

        it('decode should parse the address and return the hash160', function() {
          EQ (coinstring.decode(version, wif).toString('hex'), privateKeyHex);
          EQ (coinstring.decode(version, wifCompressed).toString('hex'), privateKeyHexCompressed);   
        })
      })
    })
  })
})


