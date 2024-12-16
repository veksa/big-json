import {PassThrough} from 'node:stream';
import {createStringifyStream} from './createStringifyStream';

interface IStringifyParams {
    body: object;
}

export const stringify = (opts: IStringifyParams) => {
    return new Promise((resolve, reject) => {
        const passThrough = new PassThrough();

        const stringifyStream = createStringifyStream(opts);

        let result = '';

        passThrough.on('data', chunk => {
            result += chunk;
        });

        passThrough.on('end', () => {
            return resolve(result);
        });

        stringifyStream.on('error', error => {
            return reject(error);
        });

        stringifyStream.pipe(passThrough);
    });
};
