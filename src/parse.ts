import {createParseStream} from './createParseStream';
import {toStream} from './_helpers/toStream';

interface IParseParams {
    body: Buffer | string;
}

export const parse = (params: IParseParams): Promise<object> => {
    const {body} = params;

    return new Promise((resolve, reject) => {
        if (typeof body !== 'string' && !Buffer.isBuffer(body)) {
            reject(new Error('Body should be a string or Buffer'));

            return;
        }

        const parseStream = createParseStream();

        parseStream.on('data', data => {
            resolve(data);
        });

        parseStream.on('error', error => {
            return reject(error);
        });

        toStream(body).pipe(parseStream);
    });
};
