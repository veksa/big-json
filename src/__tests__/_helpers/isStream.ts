export const isStream = (stream: unknown, {checkOpen = true} = {}) => {
    const streamObject = stream as {
        writable?: boolean;
        readable?: boolean;
        pipe: VoidFunction;
    };

    return streamObject !== null
        && typeof streamObject === 'object'
        && (
            streamObject.writable
            || streamObject.readable
            || !checkOpen
            || (
                streamObject.writable === undefined && streamObject.readable === undefined
            )
        )
        && typeof streamObject.pipe === 'function';
};
