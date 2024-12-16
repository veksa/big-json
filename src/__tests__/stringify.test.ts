import {stringify} from '../stringify';
import smallJson from '../__data__/small.json';

describe('stringify', () => {
    test('should stringify', done => {
        expect.assertions(1);

        stringify({body: smallJson})
            .then(str => {
                expect(str).toEqual(JSON.stringify(smallJson));

                done();
            })
            .catch(() => {
                expect(true).toBeFalsy();

                done();
            });
    });

    test('should stringify with spacing', done => {
        expect.assertions(1);

        stringify({body: smallJson, space: 4})
            .then(str => {
                expect(str).toEqual(JSON.stringify(smallJson, null, 4));

                done();
            })
            .catch(() => {
                expect(true).toBeFalsy();

                done();
            });
    });
});
