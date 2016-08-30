# mead-plugin-signature-md5

[![npm version](http://img.shields.io/npm/v/mead-plugin-signature-md5.svg?style=flat-square)](http://browsenpm.org/package/mead-plugin-signature-md5)[![Build Status](http://img.shields.io/travis/rexxars/mead-plugin-signature-md5/master.svg?style=flat-square)](https://travis-ci.org/rexxars/mead-plugin-signature-md5)[![Coverage Status](https://img.shields.io/coveralls/rexxars/mead-plugin-signature-md5/master.svg?style=flat-square)](https://coveralls.io/github/rexxars/mead-plugin-signature-md5)[![Dependency status](https://img.shields.io/david/rexxars/mead-plugin-signature-md5.svg?style=flat-square)](https://david-dm.org/rexxars/mead-plugin-signature-md5)

Mead plugin that verifies signed URLs using MD5. Bundled with Mead as the default signature method.

## Installation

```shell
# Bundled with mead by default, but if you're feeling frisky
npm install --save mead-plugin-signature-md5
```

## Usage

**Note: Bundled with Mead and enabled by default**

Your mead configuration file (`mead --config <path-to-config.js>`)

```js
module.exports = {
  // Load the plugin
  plugins: [
    require('mead-plugin-signature-md5')
  ]
}
```

## License

MIT-licensed. See LICENSE.
