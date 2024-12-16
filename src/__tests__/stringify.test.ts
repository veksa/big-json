import {stringify} from '../stringify';
import smallJson from '../__data__/small.json';

describe('stringify', () => {
    test('should stringify async', done => {
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
});
