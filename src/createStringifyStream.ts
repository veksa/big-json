import {JsonStreamStringify} from 'json-stream-stringify';

interface IStringifyStreamParams {
    body: object;
    space?: number;
    bufferSize?: number;
}

export const createStringifyStream = (params: IStringifyStreamParams) => {
    const {body, space, bufferSize = 512} = params;

    return new JsonStreamStringify(body, undefined, space, false, bufferSize);
};
