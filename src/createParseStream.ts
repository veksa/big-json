// @ts-ignore
import JSONStream from 'JSONStream';
import through2, {FlushCallback, TransformCallback} from 'through2';

export const createParseStream = () => {
    // when the parse stream gets chunks of data, it is an object with key/val
    // fields. accumulate the parsed fields.
    let accumulator: object | object[] | undefined;

    const parseStream = JSONStream.parse('$*');

    const wrapperStream = through2.obj(
        (chunk: Buffer | string, enc: BufferEncoding, cb: TransformCallback) => {
            // try to be clever (oh noes). assume we parse objects by default.
            // if the stream starts and it looks like an array, set the
            // starting value of the accumulator to an array. we opt into the
            // array, with default accumulator as an object. this introduces
            // less risk with this feature for any unexpected circumstances
            // (hopefully).
            if (accumulator === undefined) {
                const chunkStr = chunk.toString(enc).trim();
                // if the trimmed chunk is an empty string, delay initialization
                // of the accumulator till we get something meaningful
                if (chunkStr !== '') {
                    if (chunkStr.charAt(0) === '[') {
                        accumulator = [];
                    } else {
                        accumulator = {};
                    }
                }
            }
            parseStream.write(chunk);
            return cb();
        },
        (cb: FlushCallback) => {
            parseStream.on('end', () => {
                // @ts-expect-error first parameter is unused
                cb(null, accumulator);
            });
            parseStream.end();
        },
    );

    parseStream.on('data', data => {
        // this syntax should work when accumulator is object or array
        if (accumulator) {
            /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
            // @ts-expect-error array or object
            accumulator[data.key] = data.value;
            /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
        }
    });

    // make sure error is forwarded on to wrapper stream.
    parseStream.on('error', error => {
        wrapperStream.emit('error', error);
    });

    return wrapperStream;
};
