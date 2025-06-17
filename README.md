# @veksa/big-json

Optimized fork of https://github.com/DonutEspresso/big-json

[![npm version](https://img.shields.io/npm/v/@veksa/big-json.svg?style=flat-square)](https://www.npmjs.com/package/@veksa/big-json)
[![npm downloads](https://img.shields.io/npm/dm/@veksa/big-json.svg?style=flat-square)](https://www.npmjs.com/package/@veksa/big-json)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE.md)

> A stream based implementation of JSON.parse and JSON.stringify for big data

There exist many stream based implementations of JSON parsing or stringifying
for large data sets. These implementations typically target time series data, new
line delimited data or other array-like data, e.g., logging records or other
continuous flowing data.

This module hopes to fill a gap in the ecosystem: parsing large JSON objects
that are just _really_ big objects. With large in-memory objects, it is
possible to run up against the V8 string length limitation, which is currently
limited to 512MB. Thus, if your large object has enough keys
or values, it is possible to exceed the string length limit when calling
[JSON.stringify](https://github.com/nodejs/node/issues/10738).

Similarly, when retrieving stored JSON from disk or over the network, if the
JSON stringified representation of the object exceeds the string length limit,
the process will throw when attempting to convert the Buffer into a string.

The only way to work with such large objects is to use a streaming
implementation of both `JSON.parse` and `JSON.stringify`. This module does just
that by normalizing the APIs for different modules that have previously
published, combining both parse and stringify functions into a single module.
These underlying modules are subject to change at anytime.

The major caveat is that the reconstructed POJO must be able to fit in memory.
If the reconstructed POJO cannot be stored in memory, then it may be time to
reconsider the way these large objects are being transported and processed.

This module currently uses
[JSONStream](https://github.com/dominictarr/JSONStream) for parsing, and
[json-stream-stringify](https://github.com/Faleij/json-stream-stringify) for
stringification.

## Getting Started

Install the module with: `npm install @veksa/big-json`

## Usage

To parse a big JSON coming from an external source:

```js
import fs from 'fs';
import {createParseStream} from '@veksa/big-json';

const readStream = fs.createReadStream('big.json');
const parseStream = createParseStream();

parseStream.on('data', function(data) {
    // => receive reconstructed data
});

readStream.pipe(parseStream);
```

To stringify JSON:
```js
import {createStringifyStream} from '@veksa/big-json';

const stringifyStream = createStringifyStream({
    body: BIG_DATA
});

stringifyStream.on('data', function(strChunk) {
    // => BIG_DATA will be sent out in JSON chunks as the object is traversed
});
```

Promise-based API for parsing:
```js
import {parse} from '@veksa/big-json';

const result = await parse({
    body: jsonString
});
// => result contains the parsed JSON object/array
```

Promise-based API for stringifying:
```js
import {stringify} from '@veksa/big-json';

const jsonString = await stringify({
    body: bigObject
});
// => jsonString contains the stringified representation of bigObject
```

## API

### createParseStream()

Create a JSON.parse that uses a stream interface. The underlying
implementation is handled by JSONStream. This is merely a thin wrapper for
convenience that handles the reconstruction/accumulation of each
individually parsed field.

The advantage of this approach is that by also using a streams interface,
any JSON parsing or stringification of large objects won't block the CPU.

**Returns**: `Stream` - A stream interface for parsing JSON

### createStringifyStream(params)

Create a JSON.stringify readable stream.

**Parameters**:
- `params` **Object** - An options object
  - `params.body` **Object** - The JS object to JSON.stringify
  - `params.space` **number** (optional) - Number of spaces for indentation
  - `params.bufferSize` **number** (optional) - Size of the internal buffer (default: 512)

**Returns**: `Stream` - A readable stream with JSON string chunks

### parse(params)

Stream based JSON.parse with promise-based API. 

**Parameters**:
- `params` **Object** - Options to pass to parse stream
  - `params.body` **String|Buffer** - String or buffer to parse

**Returns**: `Promise<Object|Array>` - The parsed JSON

### stringify(params)

Stream based JSON.stringify with promise-based API.

**Parameters**:
- `params` **Object** - Options to pass to stringify stream
  - `params.body` **Object** - The object to be stringified
  - `params.space` **number** (optional) - Number of spaces for indentation

**Returns**: `Promise<string>` - The stringified JSON

## Contributing

This project welcomes contributions and suggestions. To contribute:

1. Fork and clone the repository
2. Install dependencies: `yarn install`
3. Make your changes
4. Run linting: `yarn lint`
5. Run tests: `yarn test`
6. Submit a pull request

## Available Scripts

- `yarn clean` - Remove the dist directory
- `yarn build` - Clean and build the project
- `yarn compile` - Run TypeScript compiler without emitting files
- `yarn lint` - Run ESLint
- `yarn test` - Run tests

## License

[MIT](LICENSE.md)
