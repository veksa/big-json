import {JsonStreamStringify} from 'json-stream-stringify';

interface IStringifyStreamParams {
    body: object;
}

export const createStringifyStream = (params: IStringifyStreamParams) => {
    const {body} = params;

    return new JsonStreamStringify(body, undefined, undefined, false, 512);
};
