var coinstring = require('../')
var conv = require('binstring');

require('terst');


describe('coinstring', function() {
  describe('> when all arguments are passed', function() {
    describe('> when Bitcoin', function() {
      describe('> when public', function() {
        it('should generate the public address', function() {
          var hash160 = "3c176e659bea0f29a3e9bf7880c112b1b31b4dc8"; //hash representing uncompressed
          var hash160Buf = conv(hash160, {in: 'hex', out: 'buffer'});
          var address = "16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS"
          var version = 0x0 //bitcoin public / pubkeyhash
          EQ (coinstring(version, hash160Buf), address);

          //EQ (coinstring.decode(version, address).toString('hex'), hash160Buf.toString('hex'));

          hash160 = "a1c2f92a9dacbd2991c3897724a93f338e44bdc1"; //hash representing compressed
          hash160Buf = conv(hash160, {in: 'hex', out: 'buffer'});
          address = '1FkKMsKNJqWSDvTvETqcCeHcUQQ64kSC6s';
          EQ (coinstring(version, hash160Buf), address)
        })
      })

      describe('> when private', function() {
        it('should generate the WIF', function() {
          var privatekeyhex = "1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd";
          var wif = "5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD"
          var version = 0x80 //bitcoin private key

          EQ (coinstring(version, conv(privatekeyhex, {in: 'hex', out: 'buffer'})), wif);

          //compressed
          var wifCompressed = 'KwomKti1X3tYJUUMb1TGSM2mrZk1wb1aHisUNHCQXTZq5auC2qc3';
          privatekeyhex += '01'; //<--- '01' at the end represents a compressed wif address
          EQ (coinstring(version, conv(privatekeyhex, {in: 'hex', out: 'buffer'})), wifCompressed);
        })
      })
    })
  })
})


