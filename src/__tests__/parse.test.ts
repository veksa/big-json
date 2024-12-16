import {readFileSync} from 'fs';
import path from 'path';
import {parse} from '../parse';
import smallJson from '../__data__/small.json';

describe('parse', () => {
    const pathToCorruptJson = path.join(__dirname, '../__data__/corrupt.json');

    test('should parse async', done => {
        expect.assertions(1);

        parse({body: JSON.stringify(smallJson)})
            .then(data => {
                expect(data).toEqual(smallJson);

                done();
            })
            .catch(() => {
                expect(true).toBeFalsy();

                done();
            });
    });

    test('should return err in parse async', done => {
        expect.assertions(2);

        const corruptStr = readFileSync(pathToCorruptJson).toString();

        parse({body: corruptStr})
            .catch((error: Error) => {
                expect(error).toBeDefined();
                expect(error.message).toEqual('Invalid JSON (Unexpected "\\n" at position 27 in state STOP)');

                done();
            });
    });

    test('should parse buffer', done => {
        expect.assertions(1);

        parse({body: Buffer.from(JSON.stringify(smallJson))})
            .then(data => {
                expect(data).toEqual(smallJson);

                done();
            })
            .catch(() => {
                expect(true).toBeFalsy();

                done();
            });
    });

    test('should return err if body is neither string nor buffer', done => {
        expect.assertions(2);

        parse({body: smallJson as unknown as string})
            .catch((error: Error) => {
                expect(error).toBeDefined();
                expect(error.message).toEqual('Body should be a string or Buffer');

                done();
            });
    });

    test('should parse root JSON Object as Object', done => {
        expect.assertions(1);

        const input = {0: {key: 'value'}, 1: {key: null}};

        parse({body: JSON.stringify(input)})
            .then(data => {
                expect(data).toEqual(input);

                done();
            })
            .catch(() => {
                expect(true).toBeFalsy();

                done();
            });
    });

    test('should parse root JSON Array as Array', done => {
        expect.assertions(1);

        const input = [{key: 'value'}, {key: null}];

        parse({body: JSON.stringify(input)})
            .then(data => {
                expect(data).toEqual(input);

                done();
            })
            .catch(() => {
                expect(true).toBeFalsy();

                done();
            });
    });
});
