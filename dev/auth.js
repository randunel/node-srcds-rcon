var Protocol = require('../lib/protocol/Protocol.js');

var protocol = new Protocol( {
    server: {
        host: '127.0.1.1',
        port: 27015
    },
    password: 'test'
});

protocol.exec('status', function(res) {
    console.log('Got res', res);
});
