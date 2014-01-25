module.exports = Packet;

function Packet(buffer) {

    this.size = buffer.readInt32LE(0);
    this.id = buffer.readInt32LE(4);
    this.type = Packet[buffer.readInt32LE(8)];
    this.body = buffer.toString('ascii', 12, buffer.length - 2);
}

Packet[0x03] = 'SERVERDATA_AUTH';
Packet[0x02] = 'SERVERDATA_AUTH_RESPONSE';
Packet[0x00] = 'SERVERDATA_RESPONSE_VALUE';
