import {Readable as ReadableStream} from 'node:stream';
import {Buffer} from 'node:buffer';

export const toStream = (input: Buffer | string) => {
    async function* reader() {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        let value = await input;

        if (!value) {
            return;
        }

        if (Array.isArray(value)) {
            value = [...value] as unknown as string;
        }

        if (
            value instanceof ArrayBuffer
            || (ArrayBuffer.isView(value) && !Buffer.isBuffer(value))
        ) {
            value = Buffer.from(value as unknown as ArrayBuffer);
        }

        // We don't iterate on strings and buffers since yielding them is ~7x faster.
        if (typeof value !== 'string' && !Buffer.isBuffer(value) && value?.[Symbol.iterator]) {
            // @ts-expect-error can be iterable
            for (const element of value) {
                yield element;
            }

            return;
        }

        // @ts-expect-error can be iterable
        if (value?.[Symbol.asyncIterator]) {
            // eslint-disable-next-line @typescript-eslint/await-thenable
            for await (const element of value) {
                // eslint-disable-next-line @typescript-eslint/await-thenable
                yield await element;
            }

            return;
        }

        yield value;
    }

    return ReadableStream.from(reader(), {objectMode: false});
};
