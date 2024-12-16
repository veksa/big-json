import {createReadStream} from 'fs';
import path from 'path';
import {PassThrough} from 'node:stream';
import {createParseStream} from '../createParseStream';
import {isStream} from './_helpers/isStream';
import smallJson from '../__data__/small.json';

describe('createParseStream', () => {
    const pathToSmallJson = path.join(__dirname, '../__data__/small.json');
    const pathToCorruptJson = path.join(__dirname, '../__data__/corrupt.json');

    const jsonString = JSON.stringify(smallJson);

    test('should create a parse stream', () => {
        const parseStream = createParseStream();

        expect(parseStream).toBeDefined();
        expect(isStream(parseStream)).toBe(true);
    });

    test('should allow writing to parse stream', done => {
        expect.assertions(1);

        createParseStream()
            .on('data', data => {
                expect(data).toEqual(smallJson);

                done();
            })
            .on('error', () => {
                expect(true).toBeFalsy();

                done();
            })
            .end(jsonString);
    });

    test('should emit "data" with reconstructed data and "end"', done => {
        expect.assertions(1);

        const parseStream = createParseStream();

        createReadStream(pathToSmallJson)
            .pipe(parseStream)
            .on('data', data => {
                expect(data).toEqual(smallJson);

                done();
            })
            .on('error', () => {
                expect(true).toBeFalsy();

                done();
            });
    });

    test('should pipe to subsequent streams', done => {
        expect.assertions(1);

        const readStream = createReadStream(pathToSmallJson);

        const parseStream = createParseStream();

        const afterStream = new PassThrough({
            objectMode: true,
        });

        afterStream.on('data', data => {
            expect(data).toEqual(smallJson);

            done();
        });

        readStream.pipe(parseStream).pipe(afterStream);
    });

    test('should pipe to multiple output streams', done => {
        expect.assertions(2);

        const readStream = createReadStream(pathToSmallJson);

        const parseStream = createParseStream();
        const afterStream = new PassThrough({
            objectMode: true,
        });
        const afterStream2 = new PassThrough({
            objectMode: true,
        });

        afterStream.on('data', data => {
            expect(data).toEqual(smallJson);
        });

        afterStream2.on('data', data => {
            expect(data).toEqual(smallJson);

            done();
        });

        readStream.pipe(parseStream).pipe(afterStream);
        parseStream.pipe(afterStream2);
    });

    test('should emit "error" event when parsing bad JSON', done => {
        expect.assertions(2);

        const parseStream = createParseStream();

        const readStream = createReadStream(pathToCorruptJson);

        parseStream.on('error', error => {
            expect(error).toBeDefined();
            expect(error.message).toEqual('Invalid JSON (Unexpected "\\n" at position 27 in state STOP)');

            done();
        });

        readStream.pipe(parseStream);
    });

    test('should handle multibyte keys and vals', done => {
        expect.assertions(1);

        const parseStream = createParseStream();

        parseStream.on('data', data => {
            expect(data).toEqual({
                遙: '遙遠未來的事件',
            });

            done();
        });

        parseStream.write('{"');
        parseStream.write(Buffer.from([0xe9, 0x81]));
        parseStream.write(Buffer.from([0x99]));
        parseStream.write('":"');
        parseStream.write(Buffer.from([0xe9, 0x81]));
        parseStream.write(Buffer.from([0x99, 0xe9, 0x81, 0xa0, 0xe6]));
        parseStream.write(Buffer.from([0x9c, 0xaa, 0xe4, 0xbe]));
        parseStream.write(
            Buffer.from([0x86, 0xe7, 0x9a, 0x84, 0xe4, 0xba, 0x8b]),
        );
        parseStream.write(Buffer.from([0xe4, 0xbb, 0xb6]));
        parseStream.end('"}');
    });

    test('should determine correct root object with leading whitespace', done => {
        expect.assertions(1);

        const parseStream = createParseStream();

        parseStream.on('data', data => {
            expect(data).toEqual({
                foo: 'bar',
            });

            done();
        });

        parseStream.write('\n\n    \n');
        parseStream.write('\n\n    {');
        parseStream.write('"foo": "bar"');
        parseStream.end('\n\n    }"');
    });

    test('should determine correct root array with leading whitespace', done => {
        expect.assertions(1);

        const parseStream = createParseStream();

        parseStream.on('data', data => {
            expect(data).toEqual([0, 1, 2]);

            done();
        });

        parseStream.write('\n\n    \n');
        parseStream.write('\n\n    [');
        parseStream.write('0, 1, 2');
        parseStream.end('\n\n    ]"');
    });
});
