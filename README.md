coinstring
==========

coinstring is a JavaScript component that is fully compatible with Node.js and the browser. It's used to generate relevant addresses and wallet import formats used by various crypto currencies.

**Note:** It's an experimental functional replacement for https://github.com/cryptocoinjs/btc-address


Installation
------------

    npm install coinstring --save


Usage
-----

There are three functions in this module.

### API

#### coinstring(version, bytes)

Used to convert either a hash160 or private key into an address or wallet import format string respectively.

- **version**: Is an integer representing the version. See below for more information.
- **bytes**: A `Buffer`, `Array`, or `Uint8Array` of bytes, either the hash160 or private key.


#### decode([version], str)

It is the inverse of the `coinstring()` function i.e. it converts the address or wallet import format into a `Buffer` of bytes. It
throws if the address or wallet import format is not valid. Not valid means that the version doesn't match, or the checksum is
incorrect. Returns an object with the follow properites `version` and `bytes`.

- **version**: Is an integer representing the version. See below for more information.
- **str**: A `string` that is either the wallet import format or public address.


#### validate(version, str)

Validates whether the address string or wallet import format string is valid. Returns a `true` or `false`.

- **version**: Is an integer representing the version. See below for more information.
- **str**: A `string` that is either the wallet import format or public address.



### Common Examples

#### Convert Private Key to Bitcoin Wallet Import Format

```js
var conv = require('binstring');
var coinstring = require('coinstring');

var privateKeyHex = "1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd";
var privateKeyHexBuf = conv(privateKeyHex, {in: 'hex', out: 'buffer'});
var version = 0x080; //Bitcoin private key

console.log(coinstring(version, privateKeyHexBuf)); // => 5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD
```

#### Convert hash160 (aka pubkeyhash) to Bitcoin Address

```js
var conv = require('binstring');
var coinstring = require('coinstring');

var hash160 = "3c176e659bea0f29a3e9bf7880c112b1b31b4dc8"; //hash representing uncompressed
var hash160Buf = conv(hash160, {in: 'hex', out: 'buffer'});
var version = 0x00; //Bitcoin public address

console.log(coinstring(version, hash160Buf)); // => 16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS
```

#### Convert Private Key to Compressed Bitcoin Wallet Import Format

```js
var conv = require('binstring');
var coinstring = require('coinstring');

var privateKeyHex = "1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd";

//for compressed, append "01"
privateKeyHex += '01';

var privateKeyHexBuf = conv(privateKeyHex, {in: 'hex', out: 'buffer'});
var version = 0x080; //Bitcoin private key

console.log(coinstring(version, privateKeyHexBuf)); // => KwomKti1X3tYJUUMb1TGSM2mrZk1wb1aHisUNHCQXTZq5auC2qc3
```

#### Convert hash160 (aka pubkeyhash) to Dogecoin Address

```js
var conv = require('binstring');
var coinstring = require('coinstring');

var hash160 = "3c176e659bea0f29a3e9bf7880c112b1b31b4dc8"; //hash representing uncompressed
var hash160Buf = conv(hash160, {in: 'hex', out: 'buffer'});
var version = 0x1E; //Dogecoin public address

console.log(coinstring(version, hash160Buf)); // => DAcq9oJpZZAjr56RmF7Y5zmWboZWQ4HAsW
```



### Functional Goodies

`coinstring` also has some functional goodies. All functions can be partially applied.

#### Function to Generate Bitcoin Wallet Import Format

```js
var conv = require('binstring');
var coinstring = require('coinstring');

var privateKeyHex = "1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd";
var privateKeyHexBuf = conv(privateKeyHex, {in: 'hex', out: 'buffer'});
var version = 0x080; //Bitcoin private key

var toBtcWif = coinstring(version)

//later in your program
console.log(toBtcWif(privateKeyHexBuf)); // => 5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD
```

#### Function to Parse Bitcoin Wallet Import Format

```js
var conv = require('binstring');
var coinstring = require('coinstring');

var wif = "5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD";
var version = 0x080; //Bitcoin private key

var fromBtcWif = coinstring.decode(version)

//later in your program
console.log(fromBtcWif(wif).bytes.toString('hex')); // => 51184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd
```

#### Function to Validate Bitcoin Testnet Addresses

```js
var conv = require('binstring');
var coinstring = require('coinstring');

var hash160 = "3c176e659bea0f29a3e9bf7880c112b1b31b4dc8"; //hash representing uncompressed
var hash160Buf = conv(hash160, {in: 'hex', out: 'buffer'});
var version = 0x6F; //Bitcoin Testnet Address

var testnetAddressValidator = coinstring.validate(version);

console.log(testnetAddressValidator("mkzgubTA5Ahi6BPSkE6MN9pEafRutznkMe")) // => true
```


### List of Common Crypto Currency Versions

The following is a table of common crypto currency versions. It may seem a bit user unfriendly to have to input the number instead of something like "BTC"; we agree. Another module will be created to address this. In the meantime, use the table below.

<table>
<tr><th>Crypto Coin</th><th>Public Address</th><th>Private Wallet Import Format</th></tr>
<tr><td>Bitcoin</td><td> 0x00</td><td> 0x80</td></tr>
<tr><td>Bitcoin Script Hash</td><td> 0x05</td><td> N/A</td></tr>
<tr><td>Bitcoin Testnet</td><td> 0x6E</td><td> 0xEF</td></tr>
<tr><td>Bitcoin Testnet Script Hash</td><td> 0xC4</td><td> N/A</td></tr>
<tr><td>Dogecoin</td><td> 0x1E</td><td> 0x9E</td></tr>
<tr><td>Litecoin</td><td> 0x30</td><td> 0xB0</td></tr>
<tr><td>Namecoin</td><td> 0x34</td><td> 0xB4</td></tr>
</table>



### Use in the Browser

Clone the repo:

    git clone https://github.com/cryptocoinjs/coinstring

Install Browserify

    npm install -g browserify

Nav to repo:

    cd coinstring

Install dependencies:

    npm install

Run browserify:

    browserify --standalone coinstring < lib/coinstring.js > lib/coinstring.bundle.js

You can now drop `coinstring.bundle.js` in a `<script>` tag.



References
----------
- http://procbits.com/2013/08/27/generating-a-bitcoin-address-with-javascript
- http://brainwallet.org/



License
-------

(MIT License)


