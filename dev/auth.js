var Rcon = require('../lib/Rcon.js');

var rcon = new Rcon('127.0.1.1:27015', 'test');

rcon.connect();

rcon.exec('status', function(res) {
    console.log('Got res', res);
});
