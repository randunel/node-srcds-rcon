'use strict';

module.exports = {
    request: request,
    response: response,
    convertPayload: convertPayload,
    SERVERDATA_AUTH: 0x03,
    SERVERDATA_AUTH_RESPONSE: 0x02,
    SERVERDATA_EXECCOMMAND: 0x02,
    SERVERDATA_RESPONSE_VALUE: 0x00,
};

function request(options) {
    let id = options.id;
    let type = options.type;
    let body = options.body;

    let bodySize = Buffer.byteLength(body);
    // Add 4 to the size (body + 10) for the null char
    let buffer = new Buffer(bodySize + 14);
    // Substract 4 because the packet size field is not included when
    // determining the size of the packet
    buffer.writeInt32LE(buffer.length - 4, 0);
    buffer.writeInt32LE(id, 4);
    buffer.writeInt32LE(type, 8);
    buffer.write(body, 12, buffer.length - 2, 'ascii');
    buffer.writeInt16LE(0x00, buffer.length - 2);

    return buffer;
}

function response(buffer) {
    let size = buffer.readInt32LE(0);
    let id = buffer.readInt32LE(4);
    let type = buffer.readInt32LE(8);
    // let body = buffer.toString('ascii', 12, buffer.length - 2);
    let payload = buffer.slice(12, buffer.length - 2);

    return {
        size: size,
        id: id,
        type: type,
        // body: body,
        payload: payload
    };
}

function convertPayload(buffer) {
    return buffer.toString('ascii');
}

