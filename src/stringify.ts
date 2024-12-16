import {PassThrough} from 'node:stream';
import {createStringifyStream} from './createStringifyStream';

interface IStringifyParams {
    body: object;
    space?: number;
}

export const stringify = (params: IStringifyParams) => {
    return new Promise((resolve, reject) => {
        const passThrough = new PassThrough();

        const stringifyStream = createStringifyStream(params);

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
