import {PassThrough} from 'node:stream';
import {createStringifyStream} from '../createStringifyStream';
import {isStream} from './_helpers/isStream';
import smallJson from '../__data__/small.json';

describe('createStringifyStream', () => {
    test('should create a stringify stream', () => {
        const stringifyStream = createStringifyStream({
            body: smallJson,
        });

        expect(stringifyStream).toBeDefined();
        expect(isStream(stringifyStream)).toBe(true);
    });

    test('should emit JSON string on data event', done => {
        expect.assertions(1);

        const stringifyStream = createStringifyStream({
            body: smallJson,
        });

        const passThrough = new PassThrough();

        let result = '';

        passThrough.on('data', (chunk: string) => {
            result += chunk;
        });

        passThrough.on('end', () => {
            expect(result).toEqual(JSON.stringify(smallJson));

            done();
        });

        stringifyStream.pipe(passThrough);
    });

    test('should serialize repeated references', done => {
        expect.assertions(1);

        const foo = {foo: 'a'};
        const body = [foo, foo];

        const stringifyStream = createStringifyStream({
            body,
        });

        let result = '';

        stringifyStream.on('data', chunk => {
            result += chunk;
        });

        stringifyStream.on('end', () => {
            expect(result).toEqual(JSON.stringify(body));

            done();
        });
    });
});
