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
- **bytes**: A `Buffer` of bytes, either the hash160 or private key.


#### decode(version, str)

It is the inverse of the `coinstring()` function i.e. it converts the address or wallet import format into a `Buffer` of bytes. It
throws if the address or wallet import format is not valid. Not valid means that the version doesn't match, or the checksum is
incorrect.

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
```


### Functional Goodness


### List of Common Crypto Currency Versions


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


